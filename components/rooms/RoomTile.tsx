import { Room } from "@/types/room";

interface RoomTileProps {
  room: Room;
  onJoin: (roomId: string) => void;
  onLeave: (roomId: string) => void;
  onView: (roomId: string) => void;
  isJoining: boolean;
  isLeaving: boolean;
  isParticipated: (roomId: string) => boolean;
}

export function RoomTile({
  room,
  onJoin,
  onLeave,
  onView,
  isJoining,
  isLeaving,
  isParticipated,
}: RoomTileProps) {
  const participated = isParticipated(room.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
          {room.name}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>{room.createdAt.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center mb-3">
          <svg
            className="w-4 h-4 text-gray-500 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span className="text-sm text-gray-700">
            作成者:{" "}
            <span className="font-medium">
              {room.creator?.username || "不明"}
            </span>
          </span>
        </div>

        <div className="flex items-center mb-4">
          <svg
            className="w-4 h-4 text-gray-500 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span className="text-sm text-gray-700">
            参加者:{" "}
            <span className="font-medium">
              {room.participants?.length || 0}人
            </span>
          </span>
        </div>

        <div className="flex space-x-2">
          {participated ? (
            <button
              onClick={() => onLeave(room.id)}
              disabled={isLeaving}
              className={`flex-1 py-2 px-4 ${
                isLeaving ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
              } text-white rounded-lg font-medium transition duration-300 flex items-center justify-center`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              {isLeaving ? "退出中..." : "退出する"}
            </button>
          ) : (
            <button
              onClick={() => onJoin(room.id)}
              disabled={isJoining}
              className={`flex-1 py-2 px-4 ${
                isJoining ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg font-medium transition duration-300 flex items-center justify-center`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
              {isJoining ? "参加中..." : "参加する"}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(room.id);
            }}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition duration-300 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            表示
          </button>
        </div>
      </div>
    </div>
  );
}
