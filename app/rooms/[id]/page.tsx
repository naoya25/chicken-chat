"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ChatInput from "@/components/common/ChatInput";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import useRealtimeMessages from "@/hooks/useRealtimeMessages";
import { Room } from "@/types/room";
import { Message } from "@/types/message";

export default function RoomPage() {
  useAuthRedirect();
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const user = useAuth();
  const messages = useRealtimeMessages(roomId);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomInfo() {
      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          name,
          created_at,
          creator:users(id, username, avatar_url),
          room_users:user(id, username, avatar_url)
        `
        )
        .eq("id", roomId)
        .single();

      if (error) {
        console.error("ルーム情報取得エラー:", error.message);
        alert("ルーム情報の取得に失敗しました: " + error.message);
        router.push("/rooms");
        return;
      }

      if (data) {
        const roomInfo: Room = {
          id: data.id,
          name: data.name,
          createdAt: data.created_at,
          creator: undefined,
          participants: undefined,
        };
        setRoom(roomInfo);
      }

      setLoading(false);
    }

    fetchRoomInfo();
  }, [roomId, router]);

  useEffect(() => {
    if (user && room) {
      const isParticipant = room.participants?.some((p) => p.id === user.id);
      if (!isParticipant) {
        alert("このルームに参加していません。");
        router.push("/rooms");
      }
    }
  }, [user, room, router]);

  const sendMessage = async (content: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    const { error } = await supabase.from("messages").insert([
      {
        room_id: roomId,
        user_id: user.id,
        content: content,
      },
    ]);

    if (error) {
      console.error("メッセージ送信エラー:", error.message);
      alert("メッセージ送信に失敗しました: " + error.message);
    }
  };

  if (loading || !room) {
    return <div>ルーム情報を読み込んでいます...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-200 flex justify-between items-center">
        <h1 className="text-2xl">{room.name}</h1>
        <div>
          <p>作成者: {room.creator?.username}</p>
          <p>参加者: {room.participants?.length}</p>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {messages.map((message: Message) => (
          <div key={message.id} className="mb-2 flex">
            <div>
              <p className="font-bold">{message.sender.username}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t">
        <ChatInput onSendMessage={sendMessage} />
      </footer>
    </div>
  );
}
