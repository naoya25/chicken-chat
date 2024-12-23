"use client";

import { useAuth } from "@/hooks/useAuth";

export default function UserInfo() {
  const user = useAuth();

  return (
    <div>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading user information...</p>}
    </div>
  );
}
