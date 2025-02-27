// File: /components/rooms/CreateRoom.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoomInsert } from "@/types/room";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const user = useAuth();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("ログインが必要です。");
      return;
    }
    if (roomName.trim() === "") {
      alert("ルーム名を入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);

      const newRoom: RoomInsert = {
        name: roomName.trim(),
        creator_id: user.id,
      };

      const { data, error } = await supabase
        .from("rooms")
        .insert(newRoom)
        .select();

      if (error) {
        console.error("ルーム作成エラー:", error.message);
        alert("ルーム作成に失敗しました: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.error("ルーム作成後のデータが取得できませんでした");
        alert("ルーム作成に失敗しました");
        return;
      }

      const newRoomData = data[0];
      const { error: joinError } = await supabase.from("room_users").insert({
        room_id: newRoomData.id,
        user_id: user.id,
      });

      if (joinError) {
        console.error("ルーム参加エラー:", joinError.message);
        alert("ルーム参加に失敗しました: " + joinError.message);
        return;
      }

      // 遷移前に少し待機して、データベースの更新が反映されるようにする
      setTimeout(() => {
        router.push(`/rooms/${newRoomData.id}`);
      }, 500);
    } catch (err) {
      console.error("予期せぬエラー:", err);
      alert("予期せぬエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateRoom}
      className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="新しいルーム名を入力..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none"
          disabled={isSubmitting}
        />
        {roomName.length > 0 && (
          <button
            type="button"
            onClick={() => setRoomName("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            作成中...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            作成
          </>
        )}
      </button>
    </form>
  );
}
