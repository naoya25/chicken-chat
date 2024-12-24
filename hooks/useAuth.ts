"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const supabaseUser = session.user;
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();
          if (error) {
            throw new Error(
              `useAuth::checkSession::supabase.from('users').select: ${error.message}`
            );
          }
          setUser(userData as User);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkSession();
  }, []);

  return user;
}
