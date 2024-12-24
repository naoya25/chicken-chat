"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user } = session;

          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (fetchError) {
            console.error('fetchError details:', fetchError);
            alert(
              "データベースからユーザーを取得中にエラーが発生しました: " +
                fetchError.message
            );
            return;
          }

          if (!existingUser) {
            const { error: insertError } = await supabase.from("users").insert({
              id: user.id,
              email: user.email,
              username: user.user_metadata.full_name || user.email,
              avatar_url: user.user_metadata.avatar_url,
            });

            if (insertError) {
              alert(
                "データベースにユーザーを挿入中にエラーが発生しました: " +
                  insertError.message
              );
            }
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw new Error(
          `handleGoogleLogin: Googleでのログイン中にエラーが発生しました - ${error.message}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("認証に失敗しました: " + error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Googleでログイン
    </button>
  );
}
