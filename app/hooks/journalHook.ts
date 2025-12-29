/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import useAuthHook from './authHook';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import { GoogleGenAI } from "@google/genai";

export default function useJournalHook() {
    const [journal, setJournal] = useState<moodProps[] | null>([]);
    const [moodAnalysis, setMoodAnalysis] = useState<moodAnalysisProps[] | null>([]);
    const [availableDay, setAvailableDay] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [moodUser, setMoodUser] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);   
    const { user } = useAuthHook();

    const moodRadio = [
        { label: "😊 Senang", value: "senang", color: "#22C55E" },
        { label: "😪 Sedih", value: "sedih", color: "#3B82F6" },
        { label: "😡 Marah", value: "marah", color: "#EF4444" },
    ];

    const fetchJournal = async () => {
        try {
            const { data } = await SupabaseAPI.from("mood").select().eq("user_id", user?.id);
            setJournal(data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchMoodAnalysis = async () => {
        try {
            const { data: activeAnalysis } = await SupabaseAPI
                .from("mood_analysis")
                .select()
                .eq("user_id", user?.id)
                .not("suggestion", "is", null)
                .order("created_at", { ascending: false })

            setMoodAnalysis(activeAnalysis)
        } catch (error) {
            console.error(error);
        }
    }

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

        fetchCheckJournal();
        fetchJournal();
        fetchMoodAnalysis();
    }, [user]);

    const handlePostJournal = async () => {
        try {
            setIsLoading(true);
            if (!availableDay) {
                ToastMessage({
                    type: "error",
                    text: "Jurnal Sudah Diisi!"
                });
                return;
            }

            if (!moodUser || !desc) {
                ToastMessage({
                    type: "error",
                    text: "Kolom Belum Diisi!"
                });
                return;
            }

            const { data: activeAnalysis, error: analysisError } = await SupabaseAPI
                .from("mood_analysis")
                .select()
                .eq("user_id", user?.id)
                .is("suggestion", null)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (analysisError) throw analysisError;
            let moodAnalysisId: number;

            if (!activeAnalysis) {
                const { data: newAnalysis, error: insertError } = await SupabaseAPI
                    .from("mood_analysis")
                    .insert([{ user_id: user?.id }])
                    .select()
                    .single();

                if (insertError) throw insertError;

                moodAnalysisId = newAnalysis.id;
            } else {
                moodAnalysisId = activeAnalysis.id;
            }

            const { error: moodError } = await SupabaseAPI
                .from("mood")
                .insert([
                    {
                        user_id: user?.id,
                        mood_analysis_id: moodAnalysisId,
                        mood: moodUser,
                        desc,
                    }
                ]);

            if (moodError) throw moodError;

            ToastMessage({
                type: "success",
                text: "Jurnal Berhasil Diisi!"
            });

            setDesc("");
            setMoodUser("");
            setAvailableDay(false);
            setShowJournal(false);

            fetchJournal();

        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getJournalByDate = (dateString: string) => {
        return journal?.find(j =>
            j.created_at.startsWith(dateString)
        );
    };

    const handleAnalysisGemini = async (moodParent: moodProps[]) => {
        try {
            const apiGemini = new GoogleGenAI({ apiKey: "AIzaSyDfWzLswH4hukpacSNpKGxtmdrawoMLqq0" });

            const journalText = moodParent.map((item, index) => {
                const data = `${index + 1}. Mood: ${item.mood}. Desc: ${item.desc}`;
                return data;
            }).join("\n");

            const prompt = `
            Kamu adalah asisten kesehatan mental yang empatik dan singkat.

            Berikut adalah jurnal mood seseorang:
            ${journalText}

            TUGAS:
            1. Buat ringkasan kondisi emosional (2–3 kalimat, bahasa Indonesia).
            2. Buat 1 saran singkat yang suportif dan realistis.

            ATURAN WAJIB:
            - Jangan menyebutkan "berdasarkan data di atas".
            - Jangan gunakan emoji.
            - Jangan gunakan markdown.
            - Jangan gunakan bullet.
            - Jangan menambahkan teks lain.

            Balas HANYA dalam format JSON VALID berikut:

            {
              "mood_primary": "mood yang dominan",
              "summary": "isi ringkasan",
              "suggestion": "isi saran",
              "statistic": "isi persentase dari mood yang dominan (1 mood aja dan hanya angka)"
            }`;

            const response = await apiGemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const parts = response?.candidates?.[0]?.content?.parts;
            let rawText;

            if (parts) {
                rawText = parts
                .map((p: any) => p.text)
                .join("")
                .trim();
            }

            let cleanText;
            if (rawText) {
                cleanText = rawText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            }

            if (cleanText) {
                const result = JSON.parse(cleanText);
                return result;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleMoodAnalysis = async () => {
        try {
            setIsLoading(true);
            const { data: activeAnalysis } = await SupabaseAPI
                .from("mood_analysis")
                .select()
                .eq("user_id", user?.id)
                .is("suggestion", null)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!activeAnalysis) {
                ToastMessage({
                    type: "error",
                    text: "Jurnal Kamu Sudah Dianalisis, Kembali Lagi Besok!"
                })
                return;
            }

            const { data: activeMood } = await SupabaseAPI
                .from("mood")
                .select()
                .eq("user_id", user?.id)
                .eq("mood_analysis_id", activeAnalysis.id)

            if (activeMood.length < 6) {
                ToastMessage({
                    type: "error",
                    text: "Analisis Jurnal Kamu Belum Tersedia, Tunggulah Beberapa Hari Lagi"
                })
                return;
            }

            const analysisResult = await handleAnalysisGemini(activeMood);
            await SupabaseAPI.from("mood_analysis").update([
                {
                    mood_user: analysisResult.mood_primary,
                    statistic: Number(analysisResult.statistic),
                    summary: analysisResult.summary,
                    suggestion: analysisResult.suggestion,
                }
            ])
            .eq("id", activeAnalysis.id)
            .select()

            ToastMessage({
                type: "success",
                text: "Analisis Selesai"
            })
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
        getJournalByDate,
        journal,
        moodUser,
        setMoodUser,
        desc,
        setDesc,
        handlePostJournal,
        isLoading,
        showJournal,
        user,
        moodRadio,
        moodAnalysis,
        handleMoodAnalysis,
    }
}
