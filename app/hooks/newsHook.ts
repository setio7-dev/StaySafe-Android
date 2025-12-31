/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import ToastMessage from '../utils/toastMessage';
import { SupabaseAPI } from '../server/supabase';

export default function useNewsHook() {
  const [news, setNews] = useState<newsProps[]>([]);
  const [newsSingle, setNewsSingle] = useState<newsProps | null>(null);
  const [search, setSearch] = useState<string>();
  const [idState, setIdState] = useState<any>(0);

  useEffect(() => {
      const subscription = SupabaseAPI
        .channel('public:news')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'news' }, (payload: any) => {
          setNews(prev => [payload.new, ...prev]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'news' }, (payload: any) => {
          setNews(prev => prev.map(item => item.id === payload.new.id ? payload.new : item)); 
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'news' }, (payload) => {
          setNews(prev => prev.filter(item => item.id !== payload.old.id)); 
        })
        .subscribe();

      return () => {
        SupabaseAPI.removeChannel(subscription);
      };
    }, []);

  const fetchNews = async() => {
      try {
          const { data } = await SupabaseAPI.from("news").select().order("created_at", { ascending: false });
          if (search) {
            const dataBySearch = data!.filter((item: any) => {
              const filter = item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
              return filter;
            });
            setNews(dataBySearch);
          } else {
            setNews(data as any);
          }
          
      } catch (error: any) {
          ToastMessage({
              type: "error",
              text: error.message
          })
      }
  }

  useEffect(() => {
    const fetchSigleNews = async() => {
      try {
        const { data } = await SupabaseAPI.from("news").select().eq("id", idState).single();
        setNewsSingle(data);
      } catch (error: any) {
        ToastMessage({
          type: "error",
          text: error.message
        })
      }
    }

    fetchNews();
    fetchSigleNews();
  }, [search, idState]);

  return {
    news,
    search,
    setSearch,
    newsSingle,
    setIdState,
    fetchNews
  }
}
