/* eslint-disable react-hooks/exhaustive-deps */
import { Animated } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import useAuthHook from './authHook';
import GeminiAPI from '../server/gemini';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import useJournalHook from './journalHook';

export default function useSafeTalkHook() {
    const translateY = useRef(new Animated.Value(0)).current;
    const [conversation, setConversation] = useState<conversationProps | null>(null);
    const [chatMessage, setChatMessage] = useState<chatbotMessageProps[] | null>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const { moodAnalysis } = useJournalHook();
    const { user } = useAuthHook();
    const timeoutRef = useRef<number | null>(null);

    const fetchConversation = async () => {
        try {
            if (!user) return;
            const { data: currentData } = await SupabaseAPI.from("chatbot_conversation").select(`*, chatbot_message(*)`).eq("user_id", user?.id).maybeSingle();
            if (!currentData) {
                await SupabaseAPI.from("chatbot_conversation").insert([
                    {
                        user_id: user?.id
                    }
                ])

                const { data: newConversation } = await SupabaseAPI.from("chatbot_conversation").select(`*, chatbot_message(*)`).eq("user_id", user?.id).maybeSingle();
                setConversation(newConversation);
                return;
            }

            setConversation(currentData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchConversation();
    }, []);

    useEffect(() => {
        const bounce = Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -12,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        bounce.start();
    }, [translateY]);

    const handleResponseAI = async (message: string) => {
        try {
            if (!user || !moodAnalysis) return;
            const prompt = `
                Kamu adalah asisten AI yang peduli dengan kesehatan mental dan psikis seseorang. 
                Berikan analisis dan saran yang ramah, empatik, dan positif berdasarkan data berikut:

                User: ${user}
                Jurnal Mood Pengguna: ${moodAnalysis ?? "belum tersedia"}

                Tugasmu:
                1. Berikan ringkasan keadaan mental user berdasarkan jurnal.
                2. Berikan saran atau tips untuk menjaga kesehatan mental.
                3. Gunakan bahasa yang ramah, empatik, dan mudah dimengerti.
                4. Jangan gunakan istilah medis yang rumit.
                5. Buat jawaban dalam 1-3 paragraf.

                Balas sebagai:
                "Asisten AI Kesehatan Mental":
            `;

            const response = await GeminiAPI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const parts = response?.candidates?.[0]?.content?.parts;
            return parts;
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        }
    }

    const handleMessage = async () => {
        try {

        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        }
    }

    return {
        translateY,
        user,
        conversation,
        fetchConversation,
        isLoading,
        message,
        setMessage,
    }
}
