import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/user";

export function useRoomActions(user: User | null) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [participatedRooms, setParticipatedRooms] = useState<
    Record<string, boolean>
  >({});

  // ユーザーが参加しているルームを取得
  useEffect(() => {
    if (!user) return;

    async function fetchParticipatedRooms() {
      try {
        const { data, error } = await supabase
          .from("room_users")
          .select("room_id")
          .eq("user_id", user!.id);

        if (error) {
          console.error("参加ルーム取得エラー:", error.message);
          return;
        }

        const roomMap: Record<string, boolean> = {};
        if (data) {
          data.forEach((item) => {
            roomMap[item.room_id] = true;
          });
        }

        setParticipatedRooms(roomMap);
      } catch (err) {
        console.error("予期せぬエラー:", err);
      }
    }

    fetchParticipatedRooms();
  }, [user]);

  const isParticipated = (roomId: string): boolean => {
    return !!participatedRooms[roomId];
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    try {
      setIsJoining(true);
      setActionError(null);

      // 既に参加しているか確認
      if (isParticipated(roomId)) {
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
        setActionError("ルーム参加に失敗しました: " + error.message);
        alert("ルーム参加に失敗しました: " + error.message);
        return;
      }

      // 参加状態を更新
      setParticipatedRooms((prev) => ({
        ...prev,
        [roomId]: true,
      }));

      alert("ルームに参加しました！");
      // 遷移前に少し待機して、データベースの更新が反映されるようにする
      setTimeout(() => {
        router.push(`/rooms/${roomId}`);
      }, 500);
    } catch (err) {
      console.error("予期せぬエラー:", err);
      setActionError("予期せぬエラーが発生しました");
      alert("予期せぬエラーが発生しました");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    try {
      setIsLeaving(true);
      setActionError(null);

      if (!confirm("このルームから退出してよろしいですか？")) {
        setIsLeaving(false);
        return;
      }

      const { error } = await supabase
        .from("room_users")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", user.id);

      if (error) {
        console.error("ルーム退出エラー:", error.message);
        setActionError("ルーム退出に失敗しました: " + error.message);
        alert("ルーム退出に失敗しました: " + error.message);
        return;
      }

      // 参加状態を更新
      setParticipatedRooms((prev) => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });

      alert("ルームから退出しました");
    } catch (err) {
      console.error("予期せぬエラー:", err);
      setActionError("予期せぬエラーが発生しました");
      alert("予期せぬエラーが発生しました");
    } finally {
      setIsLeaving(false);
    }
  };

  const navigateToRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  return {
    handleJoinRoom,
    handleLeaveRoom,
    navigateToRoom,
    isJoining,
    isLeaving,
    isParticipated,
    actionError,
  };
}
