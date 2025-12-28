import useConsultationHook from '@/app/hooks/consultationHook'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import back from "@/assets/images/icon/back.png"
import SearchPrimary from '@/app/ui/searchPrimary'
import Loader from '@/app/utils/loader'

export default function Consultation() {
    const { doctor, search, setSearch, handlePostConversation } = useConsultationHook();
    const navigate = useRouter();

    if (!doctor) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
  return (
    <CustomSafeAreaView>
        <PrimaryGradient className='flex flex-col px-6 pt-10 pb-4' roundedBottom={12}>
          <View className='flex flex-row justify-between items-center'>
            <TouchableOpacity onPress={() => navigate.back()}>
                <Image source={back} className='w-10 h-10'/>
            </TouchableOpacity>
            <Text className='font-poppins_semibold text-white text-[16px]'>Layanan Dokter</Text>
            <View className='w-12'/>
          </View>
          <SearchPrimary value={search} onChange={(e) => setSearch(e)} className='translate-y-8 elevation-md'/>
        </PrimaryGradient>
        <ScrollView className='pt-6' contentContainerStyle={{ paddingBottom: 40 }}>
            <View className='px-6 flex flex-col gap-6 mt-4'>
                {doctor.length > 0 ? (
                    doctor.map((item, index) => (
                        <View key={index} className='bg-white p-4 elevation-sm rounded-lg flex flex-row items-center gap-4'>
                            <Image source={{ uri: item.user_id.image }} className='w-28 h-full rounded-md'/>
                            <View className='flex flex-col flex-1'>
                                <Text className='font-poppins_semibold text-black text-[16px]'>Dr. {item.user_id.name}</Text>
                                <Text className='font-poppins_medium text-gray text-[12px]'>Spesialis {item.category}</Text>
                                <View className='flex items-center justify-between flex-row flex-1 mt-4'>
                                    <ButtonPrimary onClick={() => handlePostConversation(item.user_id.id)} type='secondary' text='Hubungi' textSize={10} width={80} padding={8}/>
                                    <Text className='font-poppins_medium text-gray text-[10px]'>{item.hospital}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text className='font-poppins_medium mt-4 text-black text-center text-[14px]'>Tidak Ada Dokter</Text>
                )}
            </View>
        </ScrollView>
    </CustomSafeAreaView>
  )
}
