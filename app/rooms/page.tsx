import AuthRedirectComponent from "@/components/common/AuthRedirectComponent";
import LogoutButton from "@/components/common/LogoutButton";
import UserInfo from "@/components/common/UserInfo";
import CreateRoom from "@/components/rooms/CreateRoom";
import RoomList from "@/components/rooms/RoomList";
import Link from "next/link";

/// ルーム一覧ページ
function RoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <AuthRedirectComponent />

      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
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
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  ルーム一覧
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <UserInfo />
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Section */}
      <div className="bg-white rounded-lg shadow-sm my-6 mx-4 sm:mx-6 lg:mx-8">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              新しいルームを作成
            </h2>
            <p className="text-gray-600">
              友達と会話するための新しいルームを作成しましょう
            </p>
          </div>
          <CreateRoom />
        </div>
      </div>

      {/* Room List Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
            利用可能なルーム
          </h2>
          <RoomList />
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;
