import asyncio
import re
from typing import Optional

import httpx
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials


def _get_gmail_service(access_token: str):
    creds = Credentials(token=access_token)
    return build("gmail", "v1", credentials=creds)


def _extract_unsubscribe_info(headers: list) -> tuple[Optional[str], Optional[str]]:
    for header in headers:
        if header["name"].lower() == "list-unsubscribe":
            value = header["value"]
            http_match = re.search(r"<(https?://[^>]+)>", value)
            mailto_match = re.search(r"<mailto:([^>]+)>", value)
            return (
                http_match.group(1) if http_match else None,
                mailto_match.group(1) if mailto_match else None,
            )
    return None, None


def _parse_sender(from_header: str) -> tuple[str, str]:
    email_match = re.search(r"<([^>]+)>", from_header)
    sender_email = email_match.group(1) if email_match else from_header.strip()
    sender_name = (
        from_header.split("<")[0].strip().strip('"') if "<" in from_header else from_header.strip()
    )
    return sender_email, sender_name


_SCAN_QUERY = '"unsubscribe" -in:sent -in:drafts -in:spam'


def _extract_link_from_snippet(snippet: str) -> Optional[str]:
    match = re.search(r'https?://[^\s<>"]+unsubscribe[^\s<>"]*', snippet, re.IGNORECASE)
    if match:
        return match.group(0).rstrip(".,;)")
    return None


async def scan_subscriptions(access_token: str, user_id: str, max_results: int = 500) -> list[dict]:
    service = await asyncio.to_thread(_get_gmail_service, access_token)
    subscriptions: dict[str, dict] = {}
    page_token = None
    fetched = 0

    while fetched < max_results:
        batch_size = min(100, max_results - fetched)
        kwargs: dict = {"userId": "me", "maxResults": batch_size, "q": _SCAN_QUERY}
        if page_token:
            kwargs["pageToken"] = page_token

        list_req = service.users().messages().list(**kwargs)
        results = await asyncio.to_thread(list_req.execute)
        messages = results.get("messages", [])
        if not messages:
            break

        for msg in messages:
            get_req = service.users().messages().get(
                userId="me",
                id=msg["id"],
                format="metadata",
                metadataHeaders=["From", "Date", "List-Unsubscribe"],
            )
            msg_data = await asyncio.to_thread(get_req.execute)

            headers = msg_data.get("payload", {}).get("headers", [])
            from_header = next((h["value"] for h in headers if h["name"] == "From"), "")
            date_header = next((h["value"] for h in headers if h["name"] == "Date"), None)

            sender_email, sender_name = _parse_sender(from_header)
            http_url, mailto = _extract_unsubscribe_info(headers)

            # Fall back to snippet if no List-Unsubscribe header
            if not http_url:
                http_url = _extract_link_from_snippet(msg_data.get("snippet", ""))

            if sender_email not in subscriptions:
                subscriptions[sender_email] = {
                    "user_id": user_id,
                    "sender_email": sender_email,
                    "sender_name": sender_name,
                    "unsubscribe_link": http_url,
                    "unsubscribe_mailto": mailto,
                    "status": "active",
                    "email_count": 1,
                    "last_email_date": date_header,
                }
            else:
                subscriptions[sender_email]["email_count"] += 1
                # Pick up a link if we didn't have one from an earlier email
                if not subscriptions[sender_email]["unsubscribe_link"] and http_url:
                    subscriptions[sender_email]["unsubscribe_link"] = http_url

        fetched += len(messages)
        page_token = results.get("nextPageToken")
        if not page_token:
            break

    return list(subscriptions.values())


async def check_watchers(access_token: str, watchers: list, since_days: int = 1) -> list[dict]:
    service = await asyncio.to_thread(_get_gmail_service, access_token)
    matches = []

    for watcher in watchers:
        keyword_query = " OR ".join(watcher["keywords"])
        query = f"({keyword_query}) newer_than:{since_days}d"
        if watcher.get("sender_pattern"):
            query += f" from:{watcher['sender_pattern']}"

        list_req = service.users().messages().list(userId="me", maxResults=50, q=query)
        results = await asyncio.to_thread(list_req.execute)

        for msg in results.get("messages", []):
            get_req = service.users().messages().get(
                userId="me",
                id=msg["id"],
                format="metadata",
                metadataHeaders=["From", "Subject", "Date"],
            )
            msg_data = await asyncio.to_thread(get_req.execute)

            headers = msg_data.get("payload", {}).get("headers", [])
            matches.append({
                "watcher_id": watcher["id"],
                "user_id": watcher["user_id"],
                "email_subject": next((h["value"] for h in headers if h["name"] == "Subject"), ""),
                "sender": next((h["value"] for h in headers if h["name"] == "From"), ""),
                "received_at": next((h["value"] for h in headers if h["name"] == "Date"), ""),
                "email_id": msg["id"],
                "snippet": msg_data.get("snippet", ""),
            })

    return matches


async def execute_unsubscribe(unsubscribe_link: Optional[str]) -> bool:
    if not unsubscribe_link:
        return False
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            resp = await client.get(unsubscribe_link)
            return resp.status_code < 400
    except Exception:
        return False
