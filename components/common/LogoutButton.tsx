"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
    >
      Logout
    </button>
  );
}
