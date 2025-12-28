import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function useOnboardingHook() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const navigate = useRouter();

    const handleNext = () => {
        if (currentIndex >= 2) {
            navigate.replace("/pages/home/home");
        } else {
            setCurrentIndex((prev: any) => prev + 1);
        }
    }

    return { 
        currentIndex, 
        handleNext 
    }
}
