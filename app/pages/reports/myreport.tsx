import useReportHook from '@/app/hooks/reportHook'
import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import Loader from '@/app/utils/loader'
import { useFocusEffect } from 'expo-router'
import React, { useCallback } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

export default function MyReport() {
  const { report, fetchReport, user } = useReportHook();

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      fetchReport();
    }, [user, fetchReport])
  );

  if (!report || !user) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView>
        <BackPage type={false} title='Laporan Saya'/>
        <ScrollView className='pt-8'>
          <View className='flex flex-col px-6 gap-8'>
            {report.length > 0 ? (
              report.map((item, index) => (
                <View key={index} className={`p-4 bg-white border-2 ${item.status === "menunggu" ? "border-orange-400" : item.status === "diterima" ? "border-green" : "border-red"} rounded-lg flex flex-row gap-6`}>
                  <Image source={{ uri: item.image }} className='w-20 rounded-md'/>
                  <View className='flex flex-col flex-1'>
                    <Text className='text-black font-poppins_semibold text-[14px]'>{item.title}</Text>
                    <Text className='text-black font-poppins_medium text-[12px]'>Lokasi: {item.location}</Text>
                    <Text className={`${item.status === "menunggu" ? "bg-orange-500/30 text-orange-500" : item.status === "diterima" ? "bg-green/30 text-green" : "bg-red/30 text-red"} mt-2 text-center w-[90px] py-2 rounded-lg font-poppins_medium text-[12px]`}>{item.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className='text-center font-poppins_semibold text-black text-[14px]'>Belum Ada Laporan yang Dikirim</Text>
            )}
          </View>
        </ScrollView>
    </CustomSafeAreaView>
  )
}
