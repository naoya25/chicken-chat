"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export function useAuth(): User | null {
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
          setUser(userData);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          checkSession();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
