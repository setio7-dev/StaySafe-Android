import useAuthHook from '@/app/hooks/authHook'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import guest from "@/assets/images/auth/guest.png"
import Loader from '@/app/utils/loader'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import { profileMenu } from '@/app/data/homeData'
import next from "@/assets/images/icon/next.png"

export default function Profile() {
  const { user, isLoading, handleLogout } = useAuthHook();

  if (!user) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView>
      <PrimaryGradient className='flex flex-col px-6 justify-center items-center gap-4 py-14' roundedBottom={12}>
        {user.image ? (
          <Image source={{ uri: user.image }} className='w-[80px] h-[80px]'/>
        ) : (
          <Image source={guest} className='w-[80px] h-[80px]'/>
        )}
        <View className='flex flex-col gap-2 justify-center items-center'>
          <Text className='text-white font-poppins_semibold text-[18px]'>{user?.name}</Text>
          <Text className='text-white font-poppins_medium text-[14px]'>{user?.email}</Text>
        </View>
      </PrimaryGradient>      
      <View className='mt-10 px-6 flex flex-col gap-12'>
        {profileMenu.map((item, index) => (
          <TouchableOpacity key={index} className='flex-row justify-between'>
            <View className='flex flex-row justify-center items-center gap-6'>
              <Image source={item.image} resizeMode="contain" className='w-8 h-8'/>
              <Text className='font-poppins_medium text-black text-[14px]'>{item.name}</Text>
            </View>
            <Image source={next} resizeMode='contain' className='w-8 h-8'/>
          </TouchableOpacity>
        ))}
        <ButtonPrimary onClick={() => handleLogout()} loading={isLoading} className='mt-2' text='Keluar' type='gradient' widthFull/>
      </View>
    </CustomSafeAreaView>
  )
}
