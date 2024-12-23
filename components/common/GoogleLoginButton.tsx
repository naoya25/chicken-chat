"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user } = session;

          // Check if the user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single();

          if (fetchError) {
            console.error(
              `handleGoogleLogin: Error fetching user from database - ${fetchError.message}`
            );
            alert("Error fetching user from database: " + fetchError.message);
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
              console.error(
                `handleGoogleLogin: Error inserting user into database - ${insertError.message}`
              );
              alert("Error inserting user into database: " + insertError.message);
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
          `handleGoogleLogin: Error logging in with Google - ${error.message}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Authentication failed: " + error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login with Google
    </button>
  );
}
