from app.db.supabase import get_supabase


def get_active_watchers(user_id: str) -> list:
    db = get_supabase()
    result = (
        db.table("watchers")
        .select("*")
        .eq("user_id", user_id)
        .eq("is_active", True)
        .execute()
    )
    return result.data


async def save_matches(matches: list) -> int:
    if not matches:
        return 0

    db = get_supabase()
    email_ids = [m["email_id"] for m in matches]
    existing = (
        db.table("watcher_matches")
        .select("email_id,watcher_id")
        .in_("email_id", email_ids)
        .execute()
    )
    existing_pairs = {(r["email_id"], r["watcher_id"]) for r in existing.data}

    new_matches = [
        m for m in matches if (m["email_id"], m["watcher_id"]) not in existing_pairs
    ]
    if new_matches:
        db.table("watcher_matches").insert(new_matches).execute()

    return len(new_matches)
