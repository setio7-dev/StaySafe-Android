/* eslint-disable no-unused-expressions */
import useAuthHook from '@/app/hooks/authHook'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import React, { useCallback } from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import guest from "@/assets/images/auth/guest.png"
import Loader from '@/app/utils/loader'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import { profileMenu } from '@/app/data/homeData'
import next from "@/assets/images/icon/next.png"
import { useFocusEffect, useRouter } from 'expo-router'
import useCommunityHook from '@/app/hooks/communityHook'
import useConsultationHook from '@/app/hooks/consultationHook'
import editIcon from "@/assets/images/auth/edit.png"
import FormInput from '@/app/ui/formInput'

export default function Profile() {
  const { user, isLoading, isLoadingProfile, handleLogout, name, setName, email, setEmail, password, setPassword, showForm, setShowFrom, image, handlePickImage, handleClose, handleUpdateUser, fetchUser } = useAuthHook();
  const { myCommunity, fetchCommunityMember } = useCommunityHook();
  const { myDoctor, fetchMyDoctor } = useConsultationHook();
  const navigate = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCommunityMember();
      fetchMyDoctor();
      fetchUser();
    }, [fetchCommunityMember, fetchMyDoctor, fetchUser])
  )

  if (!user || !myCommunity || !myDoctor) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView>
      {showForm && (
        <Modal visible={showForm} transparent animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white p-6 rounded-xl w-[320px] relative">
              <TouchableOpacity onPress={() => handleClose()} className='absolute bg-red w-8 h-8 rounded-full flex justify-center items-center -top-2 -right-2'>
                  <Text className='font-poppins_semibold text-white text-[14px]'>X</Text>
              </TouchableOpacity>
              <View className='flex flex-col gap-10'>
                  <View className='w-20 h-20 relative mx-auto'>
                    <TouchableOpacity className='absolute -bottom-2 -right-2 z-10' onPress={() => handlePickImage()}>
                      <Image source={editIcon} className='w-6 h-6'/>
                    </TouchableOpacity>
                    {image ? (
                      <Image source={{ uri: image }} className='w-24 h-24 mx-auto rounded-full' />
                    ) : (
                      <Image source={user.image ? { uri: user.image } : guest} className='w-24 h-24 mx-auto rounded-full' />
                    )}
                  </View>
                  <Text className='font-poppins_semibold text-primary text-[20px] text-center'>Ubah Profil</Text>
                  <View className='flex flex-col gap-4'>
                    <FormInput text='Nama' value={name} onChange={(e) => setName(e)} placeholder='Nama Anda...'/>
                    <FormInput text='Email' value={email} onChange={(e) => setEmail(e)} placeholder='Email Anda...'/>
                    <FormInput text='Kata Sandi' value={password} onChange={(e) => setPassword(e)} placeholder='Nama Anda...'/>
                  </View>
                  <ButtonPrimary loading={isLoadingProfile} text='Ubah' type='gradient' onClick={() => handleUpdateUser(user.id)} widthFull className='mt-4'/>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <PrimaryGradient className='flex flex-col px-6 justify-center items-center gap-4 py-16' roundedBottom={12}>
        {user.image ? (
          <Image source={{ uri: user.image }} className='w-[80px] h-[80px] rounded-full'/>
        ) : (
          <Image source={guest} className='w-[80px] h-[80px]'/>
        )}
        <View className='flex flex-col gap-2 justify-center items-center'>
          <Text className='text-white font-poppins_semibold text-[18px]'>{user?.name}</Text>
          <Text className='text-white font-poppins_medium text-[14px]'>{user?.email}</Text>
        </View>
        <View className='flex flex-row justify-center items-center gap-8 mt-4'>
          <Text className='bg-white px-4 py-2 rounded-lg text-secondary font-poppins_semibold text-[14px]'>{myCommunity?.length} Komunitas</Text>
          <Text className='bg-white px-4 py-2 rounded-lg text-secondary font-poppins_semibold text-[14px]'>{myDoctor?.length} Konsultasi</Text>
        </View>
      </PrimaryGradient>      
      <View className='mt-10 px-6 flex flex-col gap-12'>
        {profileMenu.map((item, index) => (
          <TouchableOpacity onPress={() => {item.link ? navigate.push(item.link as any) : setShowFrom(true)}} key={index} className='flex-row justify-between'>
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
