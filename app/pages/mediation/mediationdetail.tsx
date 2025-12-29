/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import React, { useCallback, useEffect, useRef } from 'react'
import { Image, Text, TouchableOpacity, View, Animated, Easing } from 'react-native'
import { meditationData } from '@/app/data/meditationData'
import useMediationHook from '@/app/hooks/mediationHook'
import Loader from '@/app/utils/loader'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import playImage from "@/assets/images/icon/play.png"
import stopImage from "@/assets/images/icon/stop.png"
import useAudioPlayer from '@/app/utils/audioPlayer'
import { useFocusEffect } from 'expo-router'

export default function MediationDetail() {
    const { id } = useLocalSearchParams();
    const { play, pause, isPlaying, position, duration } = useAudioPlayer();
    const { mediationSingle, setIdState, durationsMusic, currentIndex, fetchSigleMediation } = useMediationHook();

    const rotateAnim = useRef(new Animated.Value(0)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    useFocusEffect(
      useCallback(() => {        
        fetchSigleMediation()
      }, [fetchSigleMediation])
    );

    useEffect(() => {
        setIdState(id);
    }, [setIdState, id]);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start()
    }, [])

    useEffect(() => {
        fadeAnim.setValue(0)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start()
    }, [currentIndex])

    if (!mediationSingle) {
        return <Loader fullScreen={true} text='Memuat...' />
    }

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    return (
        <CustomSafeAreaView>
            <BackPage type={false} title='Meditasi' />
            <PrimaryGradient className='-translate-y-4 py-10 flex flex-col gap-10 justify-center items-center px-6' roundedBottom={20}>
                <View className='relative w-44 h-44'>
                    <View className='w-4 h-4 bg-white absolute z-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                    <Animated.Image 
                        source={{ uri: mediationSingle?.image }} 
                        className='w-44 border-2 border-white h-44 rounded-full'
                        style={{ transform: [{ rotate }] }}
                    />
                </View>
                <Animated.Text 
                    className='text-white font-poppins_semibold text-center text-[16px]'
                    style={{ opacity: fadeAnim }}
                >
                    {meditationData[currentIndex]}
                </Animated.Text>
            </PrimaryGradient>
            <View className='mt-6 flex flex-col justify-center items-center px-6'>
                <Text className='font-poppins_semibold text-black text-[24px]'>{mediationSingle?.title}</Text>
                <Text className='font-poppins_medium text-gray text-[14px]'>{mediationSingle?.author}</Text>
                <View className='flex flex-col gap-2 mt-2'>
                    <View className='flex flex-row justify-between items-center w-full'>
                        <Text className='text-secondary text-[12px] font-poppins_medium'>
                            0{position ? `${Math.floor(position / 60)}:${Math.floor(position % 60).toString().padStart(2, '0')}` : '0:00'}
                        </Text>
                        <Text className='text-secondary text-[12px] font-poppins_medium'>
                            {durationsMusic[mediationSingle?.song] ? `0${durationsMusic[mediationSingle?.song].toFixed(2)}` : "00:00"}
                        </Text>
                    </View>
                    <View className='relative'>
                        <View className='h-3 bg-secondary rounded-full absolute z-20' style={{ width: duration ? `${(position / duration) * 100}%` : '0%' }}/>
                        <View className='w-full h-3 bg-gray rounded-full' />
                    </View>
                    <TouchableOpacity onPress={() => {isPlaying ? pause() : play(mediationSingle?.song)}}>
                        <Image source={isPlaying ? stopImage : playImage} className='mx-auto mt-12 h-16 w-16' />
                    </TouchableOpacity>
                </View>
            </View>
        </CustomSafeAreaView>
    )
}
