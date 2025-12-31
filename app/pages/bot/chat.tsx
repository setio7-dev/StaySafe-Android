import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React, { useCallback } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import send from "@/assets/images/community/send.png"
import right from "@/assets/images/consultation/right.png"
import left from "@/assets/images/consultation/left.png"
import fitur2 from "@/assets/images/home/fitur2.png"
import useSafeTalkHook from '@/app/hooks/safetalkHook'
import Loader from '@/app/utils/loader'
import { useFocusEffect } from 'expo-router'
import guest from "@/assets/images/auth/guest.png"
import PrimaryGradient from '@/app/utils/primaryGradient'

export default function Chat() {
    const { fetchConversation, conversation, user, message, setMessage, handleMessage } = useSafeTalkHook();

    useFocusEffect(
        useCallback(() => {
            fetchConversation()
        }, [fetchConversation])
    )

    if (!conversation || !user) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
  return (
    <CustomSafeAreaView avoiding={-30}>
        <BackPage type={false} title='Safe Talk AI'/>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className='pt-8'>
            <View className='px-6 flex flex-col gap-12'>
                {conversation.chatbot_message.length > 0 ? (
                    conversation.chatbot_message.map((item, index) => (
                        <View key={index} className={`flex ${item.role === "user" ? 'flex-row' : 'flex-row-reverse'} gap-2 flex-1`}>
                            <View className={`flex ${item.role === "user" ? 'flex-row' : 'flex-row-reverse'} flex-1`}>
                                <PrimaryGradient className='p-4 flex-1' roundedBottom={12} roundedTop={12}>
                                    <Text className='font-poppins_medium text-justify text-white text-[12px]'>{item.message.replace(/\*\*/g, "").trim()}</Text>
                                </PrimaryGradient>
                                <Image source={item.role === "user" ? right : left} className={`w-6 h-6 ${item.role === "user" ? '-translate-x-2' : 'translate-x-2'}`}/>
                            </View>
                            <Image source={item.role === "user" && user.isWarning ? { uri: user.image } : item.role === "user" ? guest : fitur2} className='w-14 h-14 rounded-full'/>
                        </View>
                    ))
                ) : (
                    <Text className='bg-secondary text-white font-poppins_medium py-2 px-4 rounded-lg mx-auto text-[12px]'>Belum ada Percakapan</Text>
                )}
            </View>
        </ScrollView>
        <View className='mb-10 bg-white px-6 py-4'>
            <View className='items-center flex w-full justify-between flex-row gap-4'>
                <View className='flex flex-row items-center gap-2 flex-1 bg-white px-4 py-1 rounded-lg border-[1px] border-gray'>                    
                    <TextInput value={message} onChangeText={(e) => setMessage(e)} multiline className='font-poppins_medium text-black text-[12px] flex-1' placeholder='Kirim Pesanmu...' placeholderTextColor="#ACACAC" />
                </View>
                <TouchableOpacity onPress={() => handleMessage()}>
                    <Image source={send} resizeMode='contain' className='w-14 h-14' />
                </TouchableOpacity>
            </View>
        </View>
    </CustomSafeAreaView>
  )
}
