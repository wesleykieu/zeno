from app.db.supabase import get_supabase


async def upsert_subscriptions(user_id: str, subscriptions: list) -> int:
    if not subscriptions:
        return 0

    db = get_supabase()
    existing = (
        db.table("subscriptions")
        .select("sender_email")
        .eq("user_id", user_id)
        .execute()
    )
    existing_emails = {r["sender_email"] for r in existing.data}

    new_subs = [s for s in subscriptions if s["sender_email"] not in existing_emails]
    old_subs = [s for s in subscriptions if s["sender_email"] in existing_emails]

    if new_subs:
        db.table("subscriptions").insert(new_subs).execute()

    if old_subs:
        updates = [
            {
                "user_id": s["user_id"],
                "sender_email": s["sender_email"],
                "sender_name": s["sender_name"],
                "email_count": s["email_count"],
                "last_email_date": s["last_email_date"],
                "unsubscribe_link": s.get("unsubscribe_link"),
                "unsubscribe_mailto": s.get("unsubscribe_mailto"),
            }
            for s in old_subs
        ]
        # status is intentionally excluded to preserve unsubscribed/pending state
        db.table("subscriptions").upsert(updates, on_conflict="user_id,sender_email").execute()

    return len(new_subs)
