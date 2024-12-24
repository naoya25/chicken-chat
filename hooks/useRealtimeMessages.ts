import { useEffect, useState } from "react";
import { Message } from "../types/message";
import { supabase } from "@/lib/supabaseClient";

function useRealtimeMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 初期メッセージの取得
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from<Message>("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("メッセージの取得エラー:", error.message);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // リアルタイムでメッセージを購読
    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // クリーンアップ
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId]);

  return messages;
}

export default useRealtimeMessages;
