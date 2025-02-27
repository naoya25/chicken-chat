import { useEffect, useState } from "react";
import { Room, SupabaseRoom } from "@/types/room";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useAuth();

  // ルーム情報を取得する
  useEffect(() => {
    async function fetchRoomInfo() {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .single();

        if (error) {
          console.error("ルーム情報取得エラー:", error.message);
          setError("ルーム情報の取得に失敗しました: " + error.message);
          router.push("/");
          return;
        }

        if (data) {
          const room = data as SupabaseRoom;

          const { data: creatorData, error: creatorError } = await supabase
            .from("users")
            .select("id, username, avatar_url")
            .eq("id", room.creator_id)
            .single();

          if (creatorError) {
            console.error("作成者情報取得エラー:", creatorError.message);
            setError("作成者情報の取得に失敗しました: " + creatorError.message);
            router.push("/rooms");
            return;
          }

          const { data: participantsData, error: participantsError } =
            await supabase
              .from("room_users")
              .select("user_id")
              .eq("room_id", room.id);

          let participants: User[] = [];

          if (!participantsError && participantsData.length > 0) {
            const userIds = participantsData.map((p) => p.user_id);
            const { data: usersData } = await supabase
              .from("users")
              .select("id, username, avatar_url")
              .in("id", userIds);

            if (usersData) {
              participants = usersData.map((u) => ({
                id: u.id,
                username: u.username,
                email: "",
                avatar_url: u.avatar_url,
              })) as User[];
            }
          }

          const roomInfo: Room = {
            id: room.id,
            name: room.name,
            createdAt: new Date(room.created_at),
            creator: {
              id: creatorData.id,
              username: creatorData.username,
              email: "",
              avatar_url: creatorData.avatar_url,
            },
            participants: participants,
          };

          setRoom(roomInfo);
        }
      } catch (e) {
        console.error("ルーム情報取得中にエラーが発生しました:", e);
        setError("ルーム情報の取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchRoomInfo();
  }, [roomId, router]);

  // 参加者の検証
  useEffect(() => {
    if (user && room) {
      const isParticipant = room.participants?.some((p) => p.id === user.id);
      if (!isParticipant) {
        alert("このルームに参加していません。");
        router.push("/");
      }
    }
  }, [user, room, router]);

  return { room, loading, error };
}
