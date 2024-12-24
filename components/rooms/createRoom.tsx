// File: /components/rooms/CreateRoom.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
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

    // 新しいルームを作成し、creator_idを設定
    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name: roomName.trim(),
          creator_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("ルーム作成エラー:", error.message);
      alert("ルーム作成に失敗しました: " + error.message);
      return;
    }

    const newRoom = data?.[0];
    if (newRoom) {
      // 作成者をroom_usersテーブルに追加
      const { error: joinError } = await supabase.from("room_users").insert([
        {
          room_id: newRoom.id,
          user_id: user.id,
        },
      ]);

      if (joinError) {
        console.error("ルーム参加エラー:", joinError.message);
        alert("ルーム参加に失敗しました: " + joinError.message);
      }

      // 新しいルームページにリダイレクト
      router.push(`/rooms/${newRoom.id}`);
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
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
      >
        作成
      </button>
    </form>
  );
}
