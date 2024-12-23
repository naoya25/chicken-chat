"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const supabaseUser = session.user;
        const customUser: User = {
          id: supabaseUser.id,
          username: supabaseUser.user_metadata?.username || "",
          avatarUrl: supabaseUser.user_metadata?.avatar_url || "",
        };
        setUser(customUser);
      }
    };
    checkSession();
  }, []);

  return user;
}
