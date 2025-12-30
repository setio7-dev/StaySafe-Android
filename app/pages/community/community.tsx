import useCommunityHook from '@/app/hooks/communityHook'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import SearchPrimary from '@/app/ui/searchPrimary';
import PrimaryGradient from '@/app/utils/primaryGradient';
import React, { useCallback } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import back from "@/assets/images/icon/back.png"
import { useFocusEffect, useRouter } from 'expo-router';
import Loader from '@/app/utils/loader';
import ButtonPrimary from '@/app/ui/buttonPrimary';

export default function Community() {
    const { community, search, setSearch, handleJoinCommunity, isLoading, fetchCommunity } = useCommunityHook();
    const navigate = useRouter();

    useFocusEffect(
      useCallback(() => {
        fetchCommunity()
      }, [fetchCommunity])
    )

    if (!community) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
  return (
    <CustomSafeAreaView>
        <PrimaryGradient className='flex flex-col px-6 pt-10 pb-4' roundedBottom={12}>
          <View className='flex flex-row justify-between items-center'>
            <TouchableOpacity onPress={() => navigate.back()}>
                <Image source={back} className='w-10 h-10'/>
            </TouchableOpacity>
            <Text className='font-poppins_semibold text-white text-[16px]'>Semua Komunitas</Text>
            <View className='w-12'/>
          </View>
          <SearchPrimary value={search} onChange={(e) => setSearch(e)} className='translate-y-8 elevation-md'/>
        </PrimaryGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} className='px-6 mt-14'>
            <View className='flex-row flex-wrap gap-y-8 justify-between'>
                {community.length > 0 ? (
                    community.map((item, index) => (
                      <View key={index} className='flex flex-col justify-center items-center gap-6 bg-white py-10 px-4 rounded-lg w-[166px]'>
                        <Image source={{ uri: item.image }} className='w-20 h-20 object-cover rounded-full border-2 border-primary'/>
                        <View className='flex flex-col gap-1'>
                          <Text className='font-poppins_semibold text-center text-black text-[14px]'>{item.name}</Text>
                          <Text className='font-poppins_regular text-center text-gray text-[12px]'>{item.desc}</Text>
                        </View>
                        <ButtonPrimary onClick={() => handleJoinCommunity(item.id)} loading={isLoading === item.id} type='gradient' text='Gabung' textSize={12} width={100} padding={10}/>
                      </View>
                    ))
                ) : (
                    <Text className='font-poppins_medium text-center mx-auto text-[14px text-black]'>Komunitas Tidak Ditemukan</Text>
                )}
            </View>
        </ScrollView>
    </CustomSafeAreaView>
  )
}
