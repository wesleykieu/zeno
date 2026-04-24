from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user, AuthUser
from app.db.supabase import get_supabase
from app.models.schemas import WatcherCreate, WatcherUpdate

router = APIRouter()


@router.get("/matches")
async def get_watcher_matches(auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("watcher_matches")
        .select("*, watchers(name)")
        .eq("user_id", auth.user_id)
        .order("received_at", desc=True)
        .limit(100)
        .execute()
    )
    return result.data


@router.get("")
async def get_watchers(auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("watchers")
        .select("*")
        .eq("user_id", auth.user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("")
async def create_watcher(watcher: WatcherCreate, auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    data = {**watcher.model_dump(), "user_id": auth.user_id}
    result = db.table("watchers").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create watcher")
    return result.data[0]


@router.patch("/{watcher_id}")
async def update_watcher(
    watcher_id: str, updates: WatcherUpdate, auth: AuthUser = Depends(get_current_user)
):
    db = get_supabase()
    data = updates.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        db.table("watchers")
        .update(data)
        .eq("id", watcher_id)
        .eq("user_id", auth.user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Watcher not found")
    return result.data[0]


@router.delete("/{watcher_id}")
async def delete_watcher(watcher_id: str, auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    db.table("watchers").delete().eq("id", watcher_id).eq("user_id", auth.user_id).execute()
    return {"deleted": True}
