import useNewsHook from '@/app/hooks/newsHook'
import CustomSafeAreaView from '@/app/ui/safeAreaView';
import SearchPrimary from '@/app/ui/searchPrimary';
import { formatDate } from '@/app/utils/formatDate';
import Loader from '@/app/utils/loader';
import PrimaryGradient from '@/app/utils/primaryGradient';
import { useRouter } from 'expo-router';
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function News() {
  const { news, setSearch, search } = useNewsHook();
  const navigate = useRouter();
  if (!news) {
    return <Loader text='Memuat...' fullScreen={true}/>
  }

  return (
    <CustomSafeAreaView>
      <PrimaryGradient className='flex flex-col px-6 pt-10' roundedBottom={12}>
        <View className='flex-col gap-3'>
          <Text className='text-white font-poppins_semibold text-[18px] leading-9'>Temukan Semua Berita yang {'\n'}ingin Anda Ketahui</Text>
          <Text className='text-white font-poppins_medium text-[12px]'>Tetap Terhubung dengan Informasi Terkini</Text>
        </View>
        <SearchPrimary value={search} onChange={(e) => setSearch(e)} className='translate-y-6 elevation-md'/>
      </PrimaryGradient>
      <ScrollView contentContainerStyle={{ gap: 20 }} className='flex flex-col px-6 mt-16'>
        {news.length > 0 ? (
          news.map((item, index) => (
            <TouchableOpacity onPress={() => navigate.push({ pathname: "/pages/news/newsDetail", params: { id: item.id } })} key={index} className='flex-row justify-between gap-4'>
              <Image source={{ uri: item.image }} className='w-[104px] h-[104px] rounded-lg'/>
              <View className='flex-col gap-2 flex-1'>
                <Text className='font-poppins_semibold text-black text-[14px] text-justify'>{item.title.slice(0, 54) + "..."}</Text>
                <Text className='font-poppins_regular text-black text-justify text-[10px]'>{item.desc.slice(0, 80) + "..."}</Text>
                <Text className='font-poppins_medium text-black text-[10px]'>{formatDate(item.created_at)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className='font-poppins_medium text-center text-[14px text-black]'>Berita Tidak Ditemukan</Text>
        )}
      </ScrollView>
    </CustomSafeAreaView>
  )
}
