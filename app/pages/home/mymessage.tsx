import useCommunityHook from '@/app/hooks/communityHook'
import useConsultationHook from '@/app/hooks/consultationHook'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import Loader from '@/app/utils/loader'
import PrimaryGradient from '@/app/utils/primaryGradient'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function MyMessage() {
  const { myCommunity, user, fetchCommunityMember } = useCommunityHook();
  const { myDoctor, fetchMyDoctor } = useConsultationHook();
  const navigate = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      fetchCommunityMember();
      fetchMyDoctor();
    }, [user, fetchCommunityMember, fetchMyDoctor])
  );

  if (!user) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView>
      <PrimaryGradient className='flex flex-col px-6 py-10' roundedBottom={12}>
        <View className='flex-col gap-3'>
          <Text className='text-white font-poppins_semibold text-[18px] leading-9'>Pesan Pribadi Anda dalam {'\n'}Satu Tempat</Text>
          <Text className='text-white font-poppins_medium text-[12px]'>Lihat dan kelola semua pesan Anda di sini</Text>
        </View>
      </PrimaryGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View className={`flex flex-col mt-8 px-6 ${myCommunity.length > 0 ? 'gap-6' : 'gap-2'}`}>
          <Text className='text-black font-poppins_semibold text-[18px]'>Komunitas Saya</Text>
          {myCommunity.length > 0 ? (
            <View className='flex flex-col gap-6'>
              {myCommunity.map((item, index) => (
                <TouchableOpacity key={index} className='bg-white p-2' onPress={() => navigate.push({ pathname: "/pages/community/communityDetail", params: { id: item.community_id.id } })}>
                  <View className='flex flex-row items-center gap-4'>
                    <Image source={{ uri: item.community_id.image }} className='w-16 h-16 rounded-full'/>
                    <View className='flex flex-col'>
                      <Text className='text-black font-poppins_semibold text-[14px]'>{item.community_id.name}</Text>
                      <Text className='text-black font-poppins_medium text-[12px]'>{item.community_id.desc}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className='font-poppins_regular text-gray text-[12px]'>Kamu Belum Bergabung Ke Komunitas Manapun</Text>
          )}
        </View>        
        <View className={`flex flex-col mt-8 px-6 ${myDoctor.length > 0 ? 'gap-6' : 'gap-2'}`}>
          <Text className='text-black font-poppins_semibold text-[18px]'>Konsultasi Saya</Text>
          {myDoctor.length > 0 ? (
            <View className='flex flex-col gap-6'>
              {myDoctor.map((item, index) => (
                <TouchableOpacity key={index} className='bg-white p-2' onPress={() => navigate.push({ pathname: "/pages/consultation/consultationmessage", params: { id: item.id } })}>
                  <View className='flex flex-row items-center gap-4'>
                    <Image source={{ uri: item.receiver.image }} className='w-16 h-16 rounded-full'/>
                    <View className='flex flex-col'>
                      <Text className='text-black font-poppins_semibold text-[14px]'>Dr. {item.receiver.name}</Text>
                      {item.message[item.message.length - 1]?.message ? (
                        <Text className='text-gray font-poppins_medium text-[12px]'>{item.message[item.message.length - 1]?.sender?.name}: {item.message[item.message.length - 1]?.message}</Text>
                      ) : (
                        <Text className='text-gray font-poppins_medium text-[12px]'>Belum Ada Pesan</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className='font-poppins_regular text-gray text-[12px]'>Kamu Belum Melakukan Konsultasi</Text>
          )}
        </View>        
      </ScrollView>
    </CustomSafeAreaView>
  )
}
