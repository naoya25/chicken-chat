import Link from "next/link";
import Image from "next/image";

/// ホームページ
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <Image
                src="/globe.svg"
                alt="Logo"
                width={80}
                height={80}
                className="animate-pulse"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Chicken Chat
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              シンプルで使いやすいチャットアプリへようこそ。友達とつながり、リアルタイムでコミュニケーションを楽しみましょう。
            </p>
            <Link
              href="/rooms"
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-blue-600 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none"
            >
              <span className="relative">ルーム一覧を見る</span>
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">主な機能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              シンプルで使いやすい機能が揃っています
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2 text-center">
                リアルタイムチャット
              </h3>
              <p className="text-gray-600 text-center">
                友達と瞬時にメッセージを交換できます
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2 text-center">
                プライベートルーム
              </h3>
              <p className="text-gray-600 text-center">
                安全なプライベートルームで会話を楽しめます
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2 text-center">
                安全なメッセージング
              </h3>
              <p className="text-gray-600 text-center">
                プライバシーと安全性を重視した設計
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 Chicken Chat - All rights reserved
        </div>
      </div>
    </div>
  );
}
