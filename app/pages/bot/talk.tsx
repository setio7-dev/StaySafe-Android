import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React, { useCallback } from 'react'
import maskot from "@/assets/images/bot/maskot.png"
import maskotThinking from "@/assets/images/bot/maskot-thinking.png"
import mic from "@/assets/images/icon/mic.png"
import { Image, View, Animated, Text, TouchableOpacity } from 'react-native'
import useSafeTalkHook from '@/app/hooks/safetalkHook'
import Loader from '@/app/utils/loader'
import { useFocusEffect } from 'expo-router'

export default function Talk() {
  const { translateY, conversation, fetchConversation, user } = useSafeTalkHook();

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
        <Animated.View style={{ transform: [{ translateY }] }} className='flex flex-col gap-2 justify-center items-center h-[320px] px-6'>
          <Image source={maskot} className='w-[200px] h-[220px]'/>
          <View className='w-full bg-primary/30 border-2 border-primary rounded-lg p-4'>
            <Text className='font-poppins_semibold text-primary text-[14px] text-center'>Haloo</Text>
          </View>
        </Animated.View>
        <View className='flex flex-col gap-8 justify-center items-center mt-36'>
          <TouchableOpacity>
            <Image source={mic} className='w-20 h-20'/>
          </TouchableOpacity>
          <Text className='font-poppins_semibold text-black text-[14px]'>Ingin Berbicara? Tekan Tombol Mic</Text>
        </View>
    </CustomSafeAreaView>
  )
}
