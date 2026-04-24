from dataclasses import dataclass

import httpx
from fastapi import Header, HTTPException


@dataclass
class AuthUser:
    user_id: str
    access_token: str


async def get_current_user(authorization: str = Header(...)) -> AuthUser:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization[7:]
    async with httpx.AsyncClient(timeout=5) as client:
        r = await client.get(
            "https://www.googleapis.com/oauth2/v3/tokeninfo",
            params={"access_token": token},
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Token invalid or expired")
    data = r.json()
    if "sub" not in data:
        raise HTTPException(status_code=401, detail="Token has no subject")
    return AuthUser(user_id=data["sub"], access_token=token)
