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
    <form onSubmit={handleCreateRoom} className="flex space-x-2 my-4">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="新しいルーム名を入力..."
        className="flex-1 px-4 py-2 border rounded"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "作成中..." : "作成"}
      </button>
    </form>
  );
}
