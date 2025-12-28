import PrimaryGradient from '@/app/utils/primaryGradient'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import back from "@/assets/images/icon/back.png"
import { useRouter } from 'expo-router'

interface backPageProps {
  type?: boolean;
  title?: string;
}

export default function BackPage({ type=true, title }: backPageProps) {
    const navigate = useRouter();
  return (
    type ? (
      <PrimaryGradient className='px-6 py-8' roundedBottom={12}>
          <TouchableOpacity onPress={() => navigate.back()} className='flex-row items-center gap-2'>
              <Image source={back} className='w-8 h-8'/>
              <Text className='text-white font-poppins_semibold text-[16px]'>Kembali</Text>
          </TouchableOpacity>
      </PrimaryGradient>
    ) :(
      <PrimaryGradient className='flex flex-col px-6 py-8' roundedBottom={12}>
        <View className='flex flex-row justify-between items-center'>
          <TouchableOpacity onPress={() => navigate.back()}>
              <Image source={back} className='w-10 h-10'/>
          </TouchableOpacity>
          <Text className='font-poppins_semibold text-white text-[16px]'>{title}</Text>
          <View className='w-12'/>
        </View>
      </PrimaryGradient>
    )
  )
}