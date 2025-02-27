"use client";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function MessagesList({ messages }: { messages: Message[] }) {
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = Array.from(new Set(messages.map((msg) => msg.sender.id)));
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("id", userIds);

      if (error) {
        console.error("ユーザー情報の取得エラー:", error.message);
      } else {
        const usersMap: { [key: string]: User } = {};
        data?.forEach((user) => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      }
    };

    if (messages.length > 0) {
      fetchUsers();
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const user = users[message.sender.id];
        return (
          <div key={message.id} className="flex items-start space-x-2">
            {user?.avatar_url && (
              <Image
                src={user.avatar_url}
                alt={`${user.username}のアバター`}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">
                {user?.username || "Unknown User"}
              </p>
              <p>{message.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
