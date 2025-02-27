import { useEffect, useState } from "react";
import { Room, RoomRow } from "@/types/room";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return { rooms, loading, error };
}
