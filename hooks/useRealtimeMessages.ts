import { useEffect, useState, useCallback } from "react";
import { Message, SupabaseMessage } from "../types/message";
import { supabase } from "@/lib/supabaseClient";

// Supabaseのメッセージをアプリケーションのメッセージ型に変換する関数
function mapSupabaseMessageToMessage(
  msg: SupabaseMessage,
  username: string = "",
  avatarUrl: string | null = null
): Message {
  return {
    id: msg.id,
    content: msg.content,
    createdAt: new Date(msg.created_at),
    room: { id: msg.room_id, name: "", createdAt: new Date() },
    sender: {
      id: msg.user_id,
      username: username,
      email: "",
      avatar_url: avatarUrl,
    },
  };
}

function useRealtimeMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 初期メッセージの取得関数
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      // メッセージを取得
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("メッセージの取得エラー:", messagesError.message);
        setIsLoading(false);
        return;
      }

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // ユーザーIDを抽出
      const userIds = [...new Set(messagesData.map((msg) => msg.user_id))];

      // ユーザー情報を取得
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (usersError) {
        console.error("ユーザー情報の取得エラー:", usersError.message);
        // ユーザー情報なしでメッセージを表示
        const messagesWithoutUsers = messagesData.map((msg) =>
          mapSupabaseMessageToMessage(msg)
        );
        setMessages(messagesWithoutUsers);
        setIsLoading(false);
        return;
      }

      // ユーザー情報をマップに格納
      const usersMap = new Map();
      usersData.forEach((user) => {
        usersMap.set(user.id, {
          username: user.username,
          avatarUrl: user.avatar_url,
        });
      });

      // メッセージとユーザー情報を結合
      const messagesWithUsers = messagesData.map((msg) => {
        const userInfo = usersMap.get(msg.user_id) || {
          username: "",
          avatarUrl: null,
        };
        return mapSupabaseMessageToMessage(
          msg,
          userInfo.username,
          userInfo.avatarUrl
        );
      });

      setMessages(messagesWithUsers);
    } catch (error) {
      console.error("予期せぬエラー:", error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    // 初期メッセージを取得
    fetchMessages();

    console.log(`Setting up realtime subscription for room: ${roomId}`);

    // リアルタイム接続状態を確認
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`, session);
    });

    // リアルタイムでメッセージを購読
    const channelName = `room_messages_${roomId}`;

    let retryCount = 0;
    const maxRetries = 3;

    const setupSubscription = () => {
      if (retryCount >= maxRetries) {
        console.error(`Failed to subscribe after ${maxRetries} attempts`);
        return;
      }

      console.log(`Attempt ${retryCount + 1} to subscribe to ${channelName}`);

      const channel = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: true },
            presence: { key: roomId },
          },
        })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            console.log("Message event received:", payload);

            if (payload.eventType !== "INSERT") {
              console.log(`Ignoring non-INSERT event: ${payload.eventType}`);
              return;
            }

            const newMessage = payload.new as SupabaseMessage;

            try {
              const { data: userData, error } = await supabase
                .from("users")
                .select("id, username, avatar_url")
                .eq("id", newMessage.user_id)
                .single();

              if (error) {
                console.error("ユーザー情報の取得エラー:", error.message);
                const messageWithoutUser =
                  mapSupabaseMessageToMessage(newMessage);

                setMessages((prev) => {
                  if (prev.some((msg) => msg.id === messageWithoutUser.id)) {
                    console.log(
                      `Duplicate message detected, not adding: ${messageWithoutUser.id}`
                    );
                    return prev;
                  }
                  console.log(
                    `Adding new message from user ${newMessage.user_id}: ${messageWithoutUser.id}`
                  );
                  return [...prev, messageWithoutUser];
                });
                return;
              }

              const messageWithUser = mapSupabaseMessageToMessage(
                newMessage,
                userData.username,
                userData.avatar_url
              );

              setMessages((prev) => {
                if (prev.some((msg) => msg.id === messageWithUser.id)) {
                  console.log(
                    `Duplicate message detected, not adding: ${messageWithUser.id}`
                  );
                  return prev;
                }
                console.log(
                  `Adding new message from user ${userData.username}: ${messageWithUser.id}`
                );
                return [...prev, messageWithUser];
              });
            } catch (error) {
              console.error("リアルタイムメッセージ処理エラー:", error);
            }
          }
        )
        .on("presence", { event: "sync" }, () => {
          console.log("Presence synchronized");
        })
        .on("presence", { event: "join" }, ({ newPresences }) => {
          console.log("User(s) joined:", newPresences);
        })
        .on("presence", { event: "leave" }, ({ leftPresences }) => {
          console.log("User(s) left:", leftPresences);
        })
        .subscribe((status) => {
          console.log(`Subscription status for room ${roomId}: ${status}`);
          if (status === "SUBSCRIBED") {
            retryCount = 0;
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            retryCount++;

            setTimeout(() => {
              console.log("Retrying subscription...");
              setupSubscription();
            }, 2000);
          }
        });

      return () => {
        console.log(`Unsubscribing from room: ${roomId}`);
        channel.unsubscribe();
      };
    };

    const cleanup = setupSubscription();

    return () => {
      if (cleanup) cleanup();
      if (subscription) subscription.unsubscribe();
    };
  }, [roomId, fetchMessages]);

  // メッセージ送信機能
  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      if (!content.trim() || !userId) return null;

      const newMessage = {
        content,
        user_id: userId,
        room_id: roomId,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select()
        .single();

      if (error) {
        console.error("メッセージの送信エラー:", error.message);
        return null;
      }

      // 送信したメッセージをローカルで即時表示する
      try {
        // ユーザー情報を取得
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .eq("id", userId)
          .single();

        if (!userError && userData && data) {
          const messageWithUser = mapSupabaseMessageToMessage(
            data,
            userData.username,
            userData.avatar_url
          );

          // 重複を避けるためにIDをチェック
          setMessages((prev) => {
            // 既に同じIDのメッセージがあれば追加しない
            if (prev.some((msg) => msg.id === messageWithUser.id)) {
              return prev;
            }
            return [...prev, messageWithUser];
          });
        }
      } catch (err) {
        console.error("送信メッセージの表示エラー:", err);
      }

      return data;
    },
    [roomId]
  );

  return { messages, sendMessage, isLoading };
}

export default useRealtimeMessages;
