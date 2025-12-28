import { useEffect, useState } from 'react'
import useAuthHook from './authHook';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';

export default function useJournalHook() {
    const [journal, setJournal] = useState<moodProps[] | null>([]);
    const [availableDay, setAvailableDay] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [moodUser, setMoodUser] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthHook();

    useEffect(() => {
        const fetchCheckJournal = async () => {
            try {
                if (!user) return;
                
                const now = new Date()
                const start = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate(),
                        0, 0, 0
                    )
                )

                const end = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate(),
                        23, 59, 59
                    )
                )

                const { data } = await SupabaseAPI.from("mood").select().eq('user_id', user?.id).gte('created_at', start.toISOString()).lte('created_at', end.toISOString()).order('created_at', { ascending: false }).limit(1).maybeSingle();
                if (data) {
                    setAvailableDay(false);
                    setShowJournal(false);
                } else {
                    setAvailableDay(true);
                    setShowJournal(true);
                }
            } catch (error) {
                console.error(error);
            }
        }

        const fetchJournal = async () => {
            try {
                const { data } = await SupabaseAPI.from("mood").select().eq("user_id", user?.id);
                setJournal(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchCheckJournal();
        fetchJournal();
    }, [user]);

    const handlePostJournal = async () => {
        try {
            setIsLoading(true);
            if (!availableDay) {
                ToastMessage({
                    type: "error",
                    text: "Jurnal Sudah Diisi!"
                })
                return
            }

            if (!moodUser || !desc) {
                ToastMessage({
                    type: "error",
                    text: "Kolom Belum Diisi!"
                })
                return;
            }

            const { data: lastWeek } = await SupabaseAPI.from("mood_weekly").select().eq("user_id", user?.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
            let moodWeeklyId: number

            if (!lastWeek) {
                const { data: newWeek } = await SupabaseAPI.from("mood_weekly").insert([{ user_id: user?.id }]).select().single()
                moodWeeklyId = newWeek.id
            } else {
                const last = new Date(lastWeek.created_at)
                const now = new Date()
                const diffDays = (now.getTime() - last.getTime()) / 86400000

                if (diffDays >= 7) {
                    const { data: newWeek } = await SupabaseAPI.from("mood_weekly").insert([{ user_id: user?.id }]).select().single()
                    moodWeeklyId = newWeek.id
                } else {
                    moodWeeklyId = lastWeek.id
                }
            }

            await SupabaseAPI.from("mood").insert([
                {
                    user_id: user?.id,
                    mood_weekly_id: moodWeeklyId,
                    mood: moodUser,
                    desc
                }
            ])

            ToastMessage({
                type: "success",
                text: "Jurnal Berhasil Diisi!"
            })

            setDesc("");
            setMoodUser("");
            setAvailableDay(false);
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        } finally {
            setIsLoading(false);
        }
    }

    return {
        availableDay,
        setAvailableDay,
        journal,
        moodUser,
        setMoodUser,
        desc,
        setDesc,
        handlePostJournal,
        isLoading,
        showJournal
    }
}
