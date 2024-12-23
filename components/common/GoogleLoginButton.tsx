"use client";

import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {
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
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
}
