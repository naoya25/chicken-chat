"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ChatInput from "@/components/common/ChatInput";
import useRealtimeMessages from "@/hooks/useRealtimeMessages";
import { Message } from "@/types/message";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRoom } from "@/hooks/useRoom";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import Link from "next/link";

/// ルーム詳細ページ
export default function RoomPage() {
  useAuthRedirect();
  const params = useParams();
  const roomId = params.id as string;
  const user = useAuth();
  const {
    messages,
    sendMessage: realtimeSendMessage,
    isLoading: messagesLoading,
  } = useRealtimeMessages(roomId);

  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);

  const messagesEndRef = useScrollToBottom<HTMLDivElement>({
    smoothOnMount: false,
  });

  const sendMessage = async (content: string) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    await realtimeSendMessage(content, user.id);
  };

  if (roomLoading || !room) {
    return <div>ルーム情報を読み込んでいます...</div>;
  }

  if (roomError) {
    return <div>エラーが発生しました: {roomError}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="p-4 bg-white shadow-md flex justify-between items-center sticky top-0 z-10">
        <Link
          href="/rooms"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700 flex items-center">
            <span className="font-medium mr-1">作成者:</span>
            <span className="text-indigo-600">{room.creator?.username}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center">
            <span className="font-medium mr-1">参加者:</span>
            <span className="text-indigo-600">
              {room.participants?.length}人
            </span>
          </p>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        {messagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <p className="text-gray-600">メッセージを読み込んでいます...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`mb-5 ${
                  message.sender.id === user?.id ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`relative p-4 rounded-2xl max-w-[80%] shadow-sm ${
                    message.sender.id === user?.id
                      ? "ml-auto bg-indigo-500 text-white rounded-tr-none"
                      : "mr-auto bg-white text-gray-800 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <span
                      className={`font-bold ${
                        message.sender.id === user?.id
                          ? "text-indigo-100"
                          : "text-indigo-600"
                      }`}
                    >
                      {message.sender.username}
                    </span>
                    <span
                      className={`text-xs ml-2 ${
                        message.sender.id === user?.id
                          ? "text-indigo-200"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>
      <footer className="p-4 border-t border-gray-200 bg-white shadow-inner">
        <ChatInput onSendMessage={sendMessage} />
      </footer>
    </div>
  );
}
