import asyncio

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user, AuthUser
from app.models.schemas import ScanRequest, CheckWatchersRequest
from app.services import gmail_service, subscription_service, watcher_service

router = APIRouter()


@router.get("/debug")
async def debug_gmail(auth: AuthUser = Depends(get_current_user)):
    """Temporary: shows raw Gmail API response for has:list-unsubscribe"""
    from app.services.gmail_service import _get_gmail_service
    service = await asyncio.to_thread(_get_gmail_service, auth.access_token)
    req = service.users().messages().list(userId="me", maxResults=5, q='"unsubscribe" -in:sent -in:drafts -in:spam')
    results = await asyncio.to_thread(req.execute)
    return {"user_id": auth.user_id, "raw": results}


@router.post("/scan")
async def scan_emails(req: ScanRequest, auth: AuthUser = Depends(get_current_user)):
    try:
        subscriptions = await gmail_service.scan_subscriptions(
            auth.access_token, auth.user_id, req.max_results
        )
        new_count = await subscription_service.upsert_subscriptions(auth.user_id, subscriptions)
        return {"scanned": len(subscriptions), "new": new_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/check-watchers")
async def check_watchers(req: CheckWatchersRequest, auth: AuthUser = Depends(get_current_user)):
    try:
        watchers = watcher_service.get_active_watchers(auth.user_id)
        matches = await gmail_service.check_watchers(auth.access_token, watchers, req.since_days)
        saved = await watcher_service.save_matches(matches)
        return {"matches_found": len(matches), "new": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
