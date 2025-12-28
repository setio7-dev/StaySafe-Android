import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import top from "@/assets/images/onboarding/top.png";
import bottom from "@/assets/images/onboarding/bottom.png";
import nextBtn from "@/assets/images/onboarding/nextBtn.png";
import { onboardingData } from '@/app/data/onboardingData';
import useOnboardingHook from '@/app/hooks/onboardingHook';
import { Link } from 'expo-router';

export default function OnBoarding() {
  const { currentIndex, handleNext } = useOnboardingHook();
  return (
    <CustomSafeAreaView className='justify-center'>
        <View className='flex w-full h-full justify-center'>
          <Image source={top} resizeMode='cover' className='w-full h-[260px] absolute top-0 left-0'/>
          <View className='flex flex-col justify-center items-center gap-4 w-[300px] mx-auto -mt-20 relative z-20'>
            <Link className='ml-auto' href="/pages/home/home">
              <Text className='text-black ml-auto font-poppins_semibold text-[18px]'>Lewati</Text>
            </Link>
            <Image source={onboardingData[currentIndex].image} resizeMode='contain' className='w-full h-[220px]'/>
            <View className='flex flex-col gap-4 w-[300px]'>
              <Text className='text-secondary font-poppins_semibold text-center text-[22px]'>{onboardingData[currentIndex].title}</Text>
              <Text className='font-poppins_medium text-black text-[12px] text-center'>{onboardingData[currentIndex].desc}</Text>
            </View>
            <View className='flex-row justify-between items-center w-full px-10 -mt-4'>
              <View className='w-12'/>
              <View className='mt-4 flex flex-row justify-center gap-2 items-center'>
                <View className={`${currentIndex === 0 ? 'bg-primary p-1.5' : 'bg-gray p-1'} rounded-full`}/>
                <View className={`${currentIndex === 1 ? 'bg-primary p-1.5' : 'bg-gray p-1'} rounded-full`}/>
                <View className={`${currentIndex === 2 ? 'bg-primary p-1.5' : 'bg-gray p-1'} rounded-full`}/>
              </View>
              <TouchableOpacity onPress={() => handleNext()}>
                <Image source={nextBtn} resizeMode='cover' className='w-12 mt-4 h-12'/>
              </TouchableOpacity>
            </View>
          </View>
          <Image source={bottom} resizeMode='cover' className='w-full h-[260px] absolute bottom-0 right-0'/>
        </View>
    </CustomSafeAreaView>
  )
}
