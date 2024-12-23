import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user as User);
      }
    };
    checkSession();
  }, []);

  return user;
}
