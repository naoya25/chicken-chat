"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ChatInput from "@/components/common/ChatInput";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import useRealtimeMessages from "@/hooks/useRealtimeMessages";
import { Room } from "@/types/room";
import { Message } from "@/types/message";
import { User } from "@/types/user";

/// ルーム詳細ページ
export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const user = useAuth();
  const {
    messages,
    sendMessage: realtimeSendMessage,
    isLoading,
  } = useRealtimeMessages(roomId);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが来たときに自動スクロール
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    async function fetchRoomInfo() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error) {
        console.error("ルーム情報取得エラー:", error.message);
        alert("ルーム情報の取得に失敗しました: " + error.message);
        router.push("/");
        return;
      }
      if (data) {
        const room = data as Room;

        const { data: creatorData, error: creatorError } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .eq("id", room.creator?.id)
          .single();

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
          createdAt: room.createdAt,
          creator: creatorError
            ? undefined
            : ({
                id: creatorData.id,
                username: creatorData.username,
                email: "",
                avatar_url: creatorData.avatar_url,
              } as User),
          participants: participants,
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
        router.push("/");
      }
    }
  }, [user, room, router]);

  const sendMessage = async (content: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    await realtimeSendMessage(content, user.id);
  };

  if (loading || !room) {
    return <div>ルーム情報を読み込んでいます...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-200 flex justify-between items-center">
        <h1 className="text-2xl">{room.name}</h1>
        <button
          onClick={() => router.push("/")}
          className="mr-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← チャット一覧に戻る
        </button>
        <div>
          <p>作成者: {room.creator?.username}</p>
          <p>参加者: {room.participants?.length}</p>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>メッセージを読み込んでいます...</p>
          </div>
        ) : (
          <>
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`mb-4 p-3 rounded-lg ${
                  message.sender.id === user?.id
                    ? "ml-auto bg-blue-100 max-w-[80%]"
                    : "mr-auto bg-gray-100 max-w-[80%]"
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="font-bold">{message.sender.username}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="break-words">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>
      <footer className="p-4 border-t">
        <ChatInput onSendMessage={sendMessage} />
      </footer>
    </div>
  );
}
