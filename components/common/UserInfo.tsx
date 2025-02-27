"use client";

import { useAuth } from "@/hooks/useAuth";

// ユーザー情報を表示するコンポーネント
export default function UserInfo() {
  const user = useAuth();

  return (
    <div className="flex items-center">
      {user && user.username !== "" ? (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-gray-700 font-medium">{user.username}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
