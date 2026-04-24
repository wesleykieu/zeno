from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user, AuthUser
from app.db.supabase import get_supabase
from app.models.schemas import UnsubscribeRequest
from app.services import gmail_service

router = APIRouter()


@router.get("")
async def get_subscriptions(status: str = None, auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    query = db.table("subscriptions").select("*").eq("user_id", auth.user_id)
    if status:
        query = query.eq("status", status)
    result = query.order("email_count", desc=True).execute()
    return result.data


@router.post("/unsubscribe")
async def unsubscribe(req: UnsubscribeRequest, auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("subscriptions")
        .select("*")
        .eq("id", req.subscription_id)
        .eq("user_id", auth.user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub = result.data[0]
    success = await gmail_service.execute_unsubscribe(sub.get("unsubscribe_link"))
    new_status = "unsubscribed" if success else "pending"
    db.table("subscriptions").update({"status": new_status}).eq("id", req.subscription_id).execute()
    return {"success": success, "status": new_status, "unsubscribe_link": sub.get("unsubscribe_link")}


@router.delete("/{subscription_id}")
async def delete_subscription(subscription_id: str, auth: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    db.table("subscriptions").delete().eq("id", subscription_id).eq("user_id", auth.user_id).execute()
    return {"deleted": True}
