"use client";

import { useAuth } from "@/hooks/useAuth";

export default function UserInfo() {
  const user = useAuth();

  return (
    <div>
      {user && user.username !== "" ? (
        <p>Welcome, {user.username}</p>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}
