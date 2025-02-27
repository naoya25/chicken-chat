"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRooms } from "@/hooks/useRooms";
import { useRoomActions } from "@/hooks/useRoomActions";
import { RoomTile } from "./roomTile";

function RoomList() {
  const user = useAuth();
  const { rooms, loading, error } = useRooms();
  const {
    handleJoinRoom,
    handleLeaveRoom,
    navigateToRoom,
    isJoining,
    isLeaving,
    isParticipated,
  } = useRoomActions(user);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.length === 0 ? (
        <div className="col-span-full bg-blue-50 border border-blue-100 text-blue-700 px-4 py-8 rounded-lg text-center">
          <svg
            className="w-12 h-12 text-blue-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <p className="text-lg font-medium">ルームがありません</p>
          <p className="mt-2">新しいルームを作成して、会話を始めましょう</p>
        </div>
      ) : (
        rooms.map((room) => (
          <RoomTile
            key={room.id}
            room={room}
            onJoin={handleJoinRoom}
            onLeave={handleLeaveRoom}
            onView={navigateToRoom}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isParticipated={isParticipated}
          />
        ))
      )}
    </div>
  );
}

export default RoomList;
