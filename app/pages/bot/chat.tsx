import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'
import send from "@/assets/images/community/send.png"

export default function Chat() {
  return (
    <CustomSafeAreaView>
        <BackPage type={false} title='Safe Talk AI'/>
        <View className='mb-10 bg-white px-6 py-4'>
            <View className='items-center flex w-full justify-between flex-row gap-4'>
                <View className='flex flex-row items-center gap-2 flex-1 bg-white px-4 py-1 rounded-lg border-[1px] border-gray'>                    
                    <TextInput multiline className='font-poppins_medium text-black text-[12px] flex-1' placeholder='Kirim Pesanmu...' placeholderTextColor="#ACACAC" />
                </View>
                <TouchableOpacity>
                    <Image source={send} resizeMode='contain' className='w-14 h-14' />
                </TouchableOpacity>
            </View>
        </View>
    </CustomSafeAreaView>
  )
}
