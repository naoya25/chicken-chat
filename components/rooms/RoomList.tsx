"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room, RoomRow } from "@/types/room";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        setError(null);

        const { data: roomsData, error: roomsError } = await supabase
          .from("rooms")
          .select("*")
          .order("created_at", { ascending: false });

        if (roomsError) {
          console.error("ルーム取得エラー:", roomsError.message);
          setError("ルームの取得に失敗しました");
          return;
        }

        if (roomsData) {
          const roomsWithParticipants = await Promise.all(
            roomsData.map(async (room: RoomRow) => {
              const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select("id, username, avatar_url, email")
                .eq("id", room.creator_id)
                .single();

              if (creatorError) {
                console.error("作成者取得エラー:", creatorError.message);
                return {
                  id: room.id,
                  name: room.name,
                  createdAt: new Date(room.created_at),
                  creator: undefined,
                  participants: [],
                } as Room;
              }

              const { data: participantsData, error: participantsError } =
                await supabase
                  .from("room_users")
                  .select("user_id")
                  .eq("room_id", room.id);

              if (participantsError) {
                console.error("参加者取得エラー:", participantsError.message);
                return {
                  id: room.id,
                  name: room.name,
                  createdAt: new Date(room.created_at),
                  creator: creatorData as User,
                  participants: [],
                } as Room;
              }

              const participantIds = participantsData.map((p) => p.user_id);

              if (participantIds.length === 0) {
                return {
                  id: room.id,
                  name: room.name,
                  createdAt: new Date(room.created_at),
                  creator: creatorData as User,
                  participants: [],
                } as Room;
              }

              const { data: usersData, error: usersError } = await supabase
                .from("users")
                .select("id, username, avatar_url, email")
                .in("id", participantIds);

              if (usersError) {
                console.error("ユーザー取得エラー:", usersError.message);
                return {
                  id: room.id,
                  name: room.name,
                  createdAt: new Date(room.created_at),
                  creator: creatorData as User,
                  participants: [],
                } as Room;
              }

              return {
                id: room.id,
                name: room.name,
                createdAt: new Date(room.created_at),
                creator: creatorData as User,
                participants: usersData as User[],
              } as Room;
            })
          );

          setRooms(roomsWithParticipants);
        }
      } catch (err) {
        console.error("予期せぬエラー:", err);
        setError("予期せぬエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    try {
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

      alert("ルームに参加しました！");
      // 遷移前に少し待機して、データベースの更新が反映されるようにする
      setTimeout(() => {
        router.push(`/rooms/${roomId}`);
      }, 500);
    } catch (err) {
      console.error("予期せぬエラー:", err);
      alert("予期せぬエラーが発生しました");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {rooms.length === 0 ? (
        <div className="col-span-full text-center p-4">
          ルームがありません。新しいルームを作成してください。
        </div>
      ) : (
        rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">{room.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              作成日: {room.createdAt.toLocaleDateString()}
            </p>
            <p className="text-sm mb-2">
              作成者: {room.creator?.username || "不明"}
            </p>
            <p className="text-sm mb-4">
              参加者: {room.participants?.length || 0}人
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                参加する
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/rooms/${room.id}`);
                }}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
              >
                表示
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RoomList;
