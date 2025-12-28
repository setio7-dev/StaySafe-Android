/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import useMediationHook from '@/app/hooks/mediationHook'
import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import Loader from '@/app/utils/loader'
import PrimaryGradient from '@/app/utils/primaryGradient'
import useAudioPlayer from '@/app/utils/audioPlayer'
import playImage from "@/assets/images/icon/play.png"
import stopImage from "@/assets/images/icon/stop.png"
import ButtonPrimary from '@/app/ui/buttonPrimary'

export default function Mediation() {
    const { mediation, durationsMusic, handleNext } = useMediationHook();
    const { play, stop, currentUrl, isPlaying } = useAudioPlayer();
    const [selectedMeditation, setSelectedMediation] = useState<any>(null);

    if (!mediation) {
        return <Loader fullScreen={true} text='Memuat...' />
    }

    return (
        <CustomSafeAreaView>
            <BackPage type={false} title='Pilih Lagu Anda' />
            <PrimaryGradient className='-translate-y-4 h-[460px]' roundedBottom={20}>
                <ScrollView className='px-6 pt-8' contentContainerStyle={{ paddingBottom: 60 }}>
                    <View className='flex flex-col gap-8'>
                        {mediation.map((item, index) => (
                            <TouchableOpacity onPress={() => setSelectedMediation(item.id)} key={index} className={`flex flex-row items-center gap-4 bg-white p-2 rounded-lg ${selectedMeditation === item.id ? "border-2 border-green elevation-sm" : ""}`}>
                                <Image source={{ uri: item.image }} className='w-24 h-24 rounded-lg' />
                                <View className='flex flex-row justify-between items-center flex-1'>
                                    <View className='flex flex-col gap-1'>
                                        <Text className='font-poppins_semibold text-black text-[16px]'>{item.title}</Text>
                                        <Text className='font-poppins_semibold text-black text-[12px]'>{item.author}</Text>
                                        <Text className='text-gray font-poppins_medium text-[12px]'>
                                            {durationsMusic[item.song]
                                                ? `${durationsMusic[item.song].toFixed(1)} menit`
                                                : 'Memuat...'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {isPlaying ? stop() : play(item.song)}}>
                                        <Image source={currentUrl === item.song && isPlaying ? stopImage : playImage} className='w-10 mr-8 h-10' />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </PrimaryGradient>
            <View className='flex flex-col px-6 mt-6'>
                <Text className='font-poppins_semibold text-center text-secondary text-[18px]'>
                    Tentukan Irama Meditasimu
                </Text>
                <Text className='font-poppins_medium text-center text-black text-[14px]'>
                    Pilih musik yang akan menemani sesi meditasi dan membimbingmu menuju ketenangan.
                </Text>
                <ButtonPrimary onClick={() => handleNext(selectedMeditation)} type='gradient' text='Mulai' className='mt-10' padding={12} widthFull/>
            </View>
        </CustomSafeAreaView>
    )
}
