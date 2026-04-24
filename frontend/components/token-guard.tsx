"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export function TokenGuard() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("google");
    }
  }, [session?.error]);
  return null;
}
