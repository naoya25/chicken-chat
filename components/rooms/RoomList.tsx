"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room } from "@/types/room";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
        *,
        users:creator_id(id, username, avatar_url),
        participants:user_participants(id, username, avatar_url)
      `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("ルーム取得エラー:", error.message);
        return;
      }

      if (data) {
        const formattedRooms = data.map((room) => ({
          ...room,
          creator: room.creator,
          participants: room.participants,
        }));
        setRooms(formattedRooms);
      }
    }
    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    const { data: existing, error: checkError } = await supabase
      .from("room_users")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("ルーム参加チェックエラー:", checkError.message);
      alert("エラーが発生しました: " + checkError.message);
      return;
    }

    if (existing) {
      alert("既にこのルームに参加しています。");
      router.push(`/rooms/${roomId}`);
      return;
    }

    // ルームに参加
    const { error } = await supabase.from("room_users").insert([
      {
        room_id: roomId,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("ルーム参加エラー:", error.message);
      alert("ルーム参加に失敗しました: " + error.message);
      return;
    }

    router.push(`/rooms/${roomId}`);
  };

  return (
    <ul>
      {rooms.map((room) => (
        <li
          key={room.id}
          className="flex justify-between items-center p-2 border-b"
        >
          <div>
            <h2 className="text-xl">{room.name}</h2>
            {room.creator && <p>作成者: {room.creator.username}</p>}
            <p>参加者: {room.participants?.length}</p>
          </div>
          <button
            onClick={() => handleJoinRoom(room.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            参加
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
