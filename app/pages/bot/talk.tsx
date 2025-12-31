/* eslint-disable no-unused-expressions */
import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React, { useCallback } from 'react'
import maskot from "@/assets/images/bot/maskot.png"
import maskotThinking from "@/assets/images/bot/maskot-thinking.png"
import mic from "@/assets/images/icon/mic.png"
import { Image, View, Animated, Text, TouchableOpacity, ScrollView } from 'react-native'
import useSafeTalkHook from '@/app/hooks/safetalkHook'
import Loader from '@/app/utils/loader'
import { useFocusEffect } from 'expo-router'
import AudioWave from '@/app/ui/audioWave'

export default function Talk() {
  const { translateY, conversation, fetchConversation, user, handleOnMic, isListening, isLoading, message, isPlay } = useSafeTalkHook();

  const botMessage = conversation?.chatbot_message.filter((item: chatbotMessageProps) => {
    const filter = item.role === "bot";
    return filter;
  })

  useFocusEffect(
    useCallback(() => {
      fetchConversation()
    }, [fetchConversation])
  )

  if (!conversation || !user) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView>
        <BackPage type={false} title='Safe Talk AI'/>
        <Animated.View style={{ transform: [{ translateY }] }} className='flex flex-col gap-2 justify-center items-center h-[360px] px-6 mt-8'>
          <Image source={isLoading ? maskotThinking : maskot} className='w-[180px] h-[200px]'/>
          <ScrollView className='w-full bg-primary/30 border-2 border-primary rounded-lg px-4 py-8' contentContainerStyle={{ paddingBottom: 40 }}>
            {isLoading ? (
              <Text className='font-poppins_semibold text-primary text-[14px] text-center'>Stay Safe Bot Mencari Tahu...</Text>
            ) : (
              <Text className='font-poppins_semibold text-primary text-[14px] text-center'>{isPlay ? botMessage?.[botMessage?.length - 1]?.message : 'Haloo, Gimana Perasaan Kamu Hari Ini?'}</Text>
            )}
          </ScrollView>
        </Animated.View>
        <View className='flex flex-col gap-8 justify-center items-center mt-16'>
          {isListening ? (
            <View className='flex flex-col gap-8 justify-center items-center'>
              <Text className='font-poppins_semibold text-black text-[18px]'>Mendengarkan</Text>
              <AudioWave active={isListening}/>
            </View>
          ) : (
            <View className='flex flex-col gap-6 justify-center items-center'>
              <TouchableOpacity onPress={() => {isLoading ? false : handleOnMic()}}>
                <Image source={mic} className='w-20 h-20 '/>
              </TouchableOpacity>
              <Text className='font-poppins_semibold text-black text-[14px]'>Ingin Berbicara? Tekan Tombol Mic</Text>
            </View>
          )}
        </View>
        <View className='mt-4'>
          <Text className='font-poppins_semibold text-center text-black text-[14px]'>{message}</Text>
        </View>
    </CustomSafeAreaView>
  )
}
