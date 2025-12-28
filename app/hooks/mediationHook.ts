/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { SupabaseAPI } from '../server/supabase';
import { getAudioDurationMinutes } from '@/app/utils/audioPlayer'
import ToastMessage from '../utils/toastMessage';
import { usePathname, useRouter } from 'expo-router';
import * as Speech from 'expo-speech'
import { meditationData } from '../data/meditationData';

export default function useMediationHook() {
    const [mediation, setMediation] = useState<mediationProps[]>([]);    
    const [mediationSingle, setMediationSingle] = useState<mediationProps | null>(null);
    const [durationsMusic, setDurationsMusic] = useState<{ [key: string]: number }>({});
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isSpeaking, setIsSpeaking] = useState(false)
    const isCancelled = useRef(false);
    const location = usePathname();
    const [idState, setIdState] = useState<any>(null);
    const navigate = useRouter();

    useEffect(() => {
        const fetchDurations = async () => {
            if (!mediation) return
            const result: { [key: string]: number } = {}
            await Promise.all(
                mediation.map(async (item) => {
                    const minutes = await getAudioDurationMinutes(item.song)
                    result[item.song] = minutes
                })
            )
            setDurationsMusic(result)
        }
        fetchDurations()
    }, [mediation])

    useEffect(() => {
        const fetchMediation = async () => {
            try {
                const { data } = await SupabaseAPI.from("mediation").select();
                setMediation(data as any);
            } catch (error) {
                console.error(error);
            }
        }

        const fetchSigleMediation = async () => {
            try {
                const { data } = await SupabaseAPI.from("mediation").select().eq("id", idState).single();
                setMediationSingle(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchMediation(); 
        fetchSigleMediation();
    }, [idState]);

    const handleNext = (selected: number) => {
        if (!selected) {
            ToastMessage({
                type: "error",
                text: "Pilih Lagumu Terlebih Dahulu!"
            });
            return
        }

        navigate.push({ pathname: "/pages/mediation/mediationdetail", params: { id: selected } });
    }

    const speakCurrent = () => {
        if (currentIndex >= meditationData.length || location !== "/pages/mediation/mediationdetail") return
        setIsSpeaking(true)
        isCancelled.current = false

        Speech.speak(meditationData[currentIndex], {
            voice: "com.apple.ttsbundle.Karen-compact",
            volume: 0.1,
            onDone: () => {
                if (!isCancelled.current) {
                    setTimeout(() => {
                        setCurrentIndex(prev => prev + 1)
                        setIsSpeaking(false) 
                    }, 2000);
                }
            },
            onStopped: () => {
                isCancelled.current = true
                setIsSpeaking(false)
            },
            onError: () => {
                isCancelled.current = true
                setIsSpeaking(false)
            }
        })
    }

    const stop = () => {
        isCancelled.current = true
        Speech.stop()
        setIsSpeaking(false)
    }

    useEffect(() => {
        if (currentIndex < meditationData.length && isSpeaking === false) {
            speakCurrent()
        } else {
            navigate.back()
        }
    }, [currentIndex])

    return {
        mediation,
        durationsMusic,
        handleNext,
        mediationSingle,
        currentIndex,
        setCurrentIndex,
        isSpeaking,
        speakCurrent,
        stop,
        setIdState
    }
}
