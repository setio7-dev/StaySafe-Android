/* eslint-disable react-hooks/exhaustive-deps */
import { Animated, Keyboard } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import useAuthHook from './authHook';
import { useGemini } from '../server/gemini';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import useJournalHook from './journalHook';
import { startSpeechToText } from 'react-native-voice-to-text';
import { TypeWriter } from '../utils/typeWritter';
import * as Speech from 'expo-speech';

export default function useSafeTalkHook() {
    const translateY = useRef(new Animated.Value(0)).current;
    const [conversation, setConversation] = useState<chatbotConverstionProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const { journal } = useJournalHook();
    const { user } = useAuthHook();
    const [isListening, setIsListening] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [typingMessageId, setTypingMessageId] = useState<any>(null);
    const [typingText, setTypingText] = useState("");
    const GeminiAPI = useGemini();

    const fetchConversation = async () => {
        try {
            if (!user) return;
            const { data: currentData } = await SupabaseAPI.from("chatbot_conversation").select(`*, chatbot_message(*)`).eq("user_id", user?.id).single();
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
            if (!user || !journal) return;
            const prompt = `
                Kamu adalah asisten AI bernama "Stay Safe Bot" yang peduli dengan kesehatan mental dan psikis seseorang. 
                Tugasmu adalah menganalisis jurnal mood pengguna dan memberikan saran yang ramah, empatik, dan positif.

                Data pengguna:
                Pengguna: ${JSON.stringify(user, null, 2)}
                Jurnal Mood Pengguna: ${JSON.stringify(journal, null, 2)}

                Aturan tugasmu:
                1. Berikan ringkasan keadaan mental pengguna berdasarkan jurnal mood.
                2. Berikan saran atau tips untuk menjaga kesehatan mental.
                3. Gunakan bahasa yang ramah, empatik, dan mudah dimengerti.
                4. Jangan gunakan istilah medis yang rumit.
                5. Jawaban maksimal 1-3 paragraf.
                6. Jangan menjawab pertanyaan di luar topik kesehatan mental.
                7. Jika pengguna menanyakan identitasmu, jawab singkat: "Saya Stay Safe Bot, asisten AI untuk kesehatan mental.
                8. Jika pengguna hanya menyapa maka sapa dan perkanalan diri aja jangan lampirkan apa-apa."

                Pertanyaan Pengguna: ${message}
            `;

            const response = await GeminiAPI?.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const parts = response?.candidates?.[0]?.content?.parts;
            if (Array.isArray(parts)) {
                const textArray = parts.map(p => {
                    if (typeof p === "string") return p;
                    if (p && typeof p === "object" && "text" in p) return String(p.text);
                    return "";
                });
                return textArray.join("\n").trim();
            }

            if (typeof parts === "string") return parts;
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
            console.error(error);
        }
    }

    const handleMessage = async (text?: string) => {
        try {
            if (!user || !conversation) return;
            Keyboard.dismiss();
            setIsLoading(true)

            const finalMessage = text ?? message;
            if (!finalMessage) {
                ToastMessage({
                    type: "error",
                    text: "Pesan Harus Diisi!"
                });
                return;
            }

            await SupabaseAPI.from("chatbot_message").insert([
                {
                    conversation_id: conversation?.id,
                    message: finalMessage,
                    role: "user"
                }
            ]);

            const handleLogicBot = await handleResponseAI(finalMessage);
            const { data: botMessage } = await SupabaseAPI.from("chatbot_message").insert([
                {
                    conversation_id: conversation?.id,
                    message: handleLogicBot,
                    role: "bot"
                }
            ]).select().single()

            handleBotReply(botMessage.id, handleLogicBot as any);
            setIsPlay(true);
            setMessage("");
            fetchConversation();

            return handleLogicBot;
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleOnMic = async () => {
        try {
            setIsListening(true);
            setMessage('');

            const result = await startSpeechToText();
            setIsListening(false);
            const botReply = await handleMessage(result as any);

            speakText(botReply);
            setMessage("");
        } catch (error: any) {
            setIsListening(false);
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        }
    };

    const speakText = ( text: any, options?: Partial<Speech.SpeechOptions> ) => {
        if (!text) return;

        Speech.stop();
        Speech.speak(text, {
            language: 'id-ID',
            rate: 0.9,
            pitch: 1.0,
            ...options,
        });
    };

    const handleBotReply = async (messageId: string, reply: string) => {
        setTypingMessageId(messageId);
        setTypingText("");

        await TypeWriter({
            text: reply,
            speed: 25,
            onUpdate: setTypingText,
            onDone: () => {
                setTypingMessageId(null);
            }
        });
    };


    return {
        translateY,
        user,
        conversation,
        fetchConversation,
        isLoading,
        message,
        setMessage,
        handleMessage,
        handleOnMic,
        isListening,
        isPlay,
        typingMessageId,
        typingText
    }
}
