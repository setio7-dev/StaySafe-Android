import React, { useEffect, useState } from 'react'
import { SupabaseAPI } from '../server/supabase';

export default function useUserHook() {
  const [user, setUser] = useState<authProps | null>(null);

  useEffect(() => {
    const fetchUser = async() => {
        try {
            const { data } = await SupabaseAPI.auth.getUser();
            const { data: userData } = await SupabaseAPI.from("users").select().eq("auth_id", data.user?.id).single();

            setUser(userData);
        } catch (error) {
            console.error(error);
        }
    }

    fetchUser();
  }, []);

  return {
    user
  }
}
