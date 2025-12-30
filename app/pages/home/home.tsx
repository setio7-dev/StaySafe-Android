import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import logo from "@/assets/images/home/logo.png";
import cloud from "@/assets/images/home/cloud.png";
import ButtonPrimary from '@/app/ui/buttonPrimary';
import { homeData, postAnimation } from '@/app/data/homeData';
import lapor from "@/assets/images/home/lapor-cepat.png";
import Loader from '@/app/utils/loader';
import useNewsHook from '@/app/hooks/newsHook';
import { formatDate } from '@/app/utils/formatDate';
import useCommunityHook from '@/app/hooks/communityHook';
import journal from "@/assets/images/home/journal.png"
import { useFocusEffect, useRouter } from 'expo-router';
import ModalJournal from '@/app/components/ModalJournal';
import useJournalHook from '@/app/hooks/journalHook';
import useMapsHooks from '@/app/hooks/mapsHooks';
import WebView from 'react-native-webview';
import useAuthHook from '@/app/hooks/authHook';

const { width } = Dimensions.get("window");

export default function Home() {
  const { user, fetchUser } = useAuthHook();
  const { news } = useNewsHook();
  const { location, icons, generateMapHTML, myLocation, fetchZones, handleMessageDistance, isWarning, fetchMaps } = useMapsHooks();
  const { availableDay, setAvailableDay } = useJournalHook();
  const { community, isLoading, handleJoinCommunity } = useCommunityHook();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);
  const navigate = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % postAnimation.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width * 0.96, animated: true }); 
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useFocusEffect(
      useCallback(() => {
          fetchUser()
          fetchZones()
          fetchMaps()
      }, [fetchZones, fetchMaps, fetchUser])
  )

  if (!user || !news || !community || !location) {
    return <Loader text='Memuat...' fullScreen={true}/>
  }

  return (
    <CustomSafeAreaView>
        <ModalJournal show={availableDay} onClose={() => setAvailableDay(false)}/>
        <ScrollView>
          <PrimaryGradient className='py-8 px-6 flex flex-col gap-4' roundedBottom={12}>
              <Image source={logo} className='w-[160px] h-[70px]'/>
              <View className='flex flex-col gap-1'>
                  <Text className='text-white font-poppins_semibold text-[20px]'>HI, {user?.name.toLocaleUpperCase()}</Text>
                  <Text className='font-poppins_medium text-white text-[14px]'>Gimana Kabarmu?</Text>
              </View>
              <View className='w-full rounded-md bg-white mt-4 h-[160px] flex flex-row justify-between p-4 gap-4'>
                <View className='w-[120px] h-full border-2 border-secondary rounded-lg'>
                  <WebView
                      originWhitelist={['*']}
                      source={{
                          html: generateMapHTML(location?.lat, location?.lng, icons),
                      }}
                      style={{ flex: 1 }}
                      scalesPageToFit={false}
                      javaScriptEnabled
                      onMessage={(event) => handleMessageDistance(event)}
                  />  
                </View>
                <View className='flex-1 flex flex-col justify-between'>
                  <View className='flex flex-col flex-1'>
                    <Text className='text-gray text-[12px] font-poppins_medium'>Lokasi Kamu</Text>
                    <Text className='text-primary text-[16px] font-poppins_semibold'>{myLocation}</Text>
                    <Text className='text-gray text-[10px] font-poppins_medium'>Status</Text>
                    <View className='flex flex-row gap-2 items-center'>
                      <View className={`${isWarning ? 'bg-red' : 'bg-green'} p-1.5 rounded-full`}/>
                      <Text className={`${isWarning ? 'text-red' : 'text-green'} text-[12px] font-poppins_medium`}>{isWarning ? 'Waspada' : 'Aman'}</Text>
                    </View>
                  </View>
                  <View className='flex flex-row justify-between items-end'>
                    <ButtonPrimary onClick={() => navigate.push("/pages/maps/maps")} type='gradient' textSize={10} padding={8} rounded={10} width={120} text='Periksa Lokasimu' />                    
                    <View className='flex flex-col justify-center items-center'>
                      <Image source={cloud} resizeMode='cover' className='w-12 h-10'/>
                      <Text className='text-[12px] font-poppins_medium text-primary'>35°C</Text>
                    </View>
                  </View>
                </View>
              </View>
          </PrimaryGradient>
          <View className='flex flex-row justify-between px-6 mt-6 items-center'>
            {homeData.map((item, index) => (
              <TouchableOpacity onPress={() => navigate.push(item.link as any)} key={index} className='flex flex-col gap-4 justify-center items-center'>
                <Image source={item.image} resizeMode='cover' className='w-[60px] h-[60px]'/>
                <Text className='text-black font-poppins_medium text-[12px]'>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className='px-6 mt-8'>
            <PrimaryGradient className='flex flex-row justify-between items-center p-4 gap-4' roundedBottom={8} roundedTop={8}>
              <Image source={lapor} resizeMode='cover' className='w-[90px] h-[90px]'/>
              <View className='flex flex-col flex-1'>
                <Text className='font-poppins_semibold text-white text-[16px]'>Lapor Cepat Sekitarmu</Text>
                <Text className='font-poppins_medium text-justify text-white text-[10px]'>Lapor kejadian darurat dengan cepat, cukup dengan sekali klik  foto atau lokasi.</Text>
                <TouchableOpacity onPress={() => navigate.push("/pages/reports/report")} className='bg-white rounded-lg w-[80px] flex justify-center items-center py-1.5 mt-4'>
                  <Text className='font-poppins_semibold text-primary text-[14px]'>Lapor</Text>
                </TouchableOpacity>
              </View>
            </PrimaryGradient>
          </View>
          <ScrollView ref={scrollRef} className='mt-8 mx-6 rounded-lg' showsHorizontalScrollIndicator={false} horizontal>
            {postAnimation.map((item, index) =>(
              <View key={index}  style={{ width: width * 0.9 + 12, marginRight: 12 }}>
                <Image source={item.image} resizeMode='cover' style={{ width: "100%", height: 200, borderRadius: 12 }}/>
              </View>
            ))}
          </ScrollView>          
          <View className='w-full flex-row flex-1 justify-between items-center px-6 mt-10'>
            <Text className='font-poppins_semibold text-black text-[22px]'>Komunitas</Text>
            <Text onPress={() => navigate.push("/pages/community/community")} className='text-secondary font-poppins_medium underline'>Lainnya</Text>
          </View>
          <ScrollView className='mt-4 mx-6' showsHorizontalScrollIndicator={false} horizontal>
            {community.slice(0, 5).map((item, index) => (
              <View key={index} className='flex flex-col justify-center items-center gap-6 bg-white py-10 px-4 rounded-lg w-[200px]' style={{ marginRight: 20 }}>
                <Image source={{ uri: item.image }} className='w-20 h-20 object-cover rounded-full border-2 border-primary'/>
                <View className='flex flex-col gap-1'>
                  <Text className='font-poppins_semibold text-center text-black text-[14px]'>{item.name}</Text>
                  <Text className='font-poppins_regular text-center text-gray text-[12px]'>{item.desc}</Text>
                </View>
                <ButtonPrimary onClick={() => handleJoinCommunity(item.id)} loading={isLoading === item.id} type='gradient' text='Gabung' textSize={12} width={100} padding={10}/>
              </View>
            ))}
          </ScrollView>
          <View className='px-6 mt-8'>
            <PrimaryGradient className='flex flex-row justify-between items-center p-4 gap-2' roundedBottom={8} roundedTop={8}>
              <Image source={journal} resizeMode='cover' className='w-[110px] h-[110px]'/>
              <View className='flex flex-col flex-1'>
                <Text className='font-poppins_semibold text-white text-[16px]'>Jurnal Harianmu</Text>
                <Text className='font-poppins_medium text-justify text-white text-[10px]'>Catat aktivitas, perasaan, dan momen pentingmu setiap hari dengan mudah.</Text>
                <TouchableOpacity onPress={() => navigate.push("/pages/journal/journal")} className='bg-white rounded-lg w-[100px] flex justify-center items-center py-1.5 mt-4'>
                  <Text className='font-poppins_semibold text-primary text-[14px]'>Isi Jurnal</Text>
                </TouchableOpacity>
              </View>
            </PrimaryGradient>
          </View>
          <View className='w-full flex-row flex-1 justify-between items-center px-6 mt-10'>
            <Text className='font-poppins_semibold text-black text-[22px]'>Berita</Text>
            <Text className='text-secondary font-poppins_medium underline' onPress={() => navigate.push("/pages/home/news")}>Lainnya</Text>
          </View>
          <ScrollView className='mt-4 mx-6 mb-12' showsHorizontalScrollIndicator={false} horizontal>
            {news.slice(0, 5).map((item, index) => (
              <TouchableOpacity onPress={() => navigate.push({ pathname: "/pages/news/newsDetail", params: {id: item.id} })} key={index} className='w-[260px]' style={{ marginRight: 20 }}>
                <Image source={{ uri: item.image }} className='w-[260px] h-[160px] rounded-lg'/>
                <View className='flex flex-col gap-2 mt-4'>
                  <Text className='font-poppins_medium text-black text-[12px]'>{formatDate(item.created_at)}</Text>
                  <Text className='font-poppins_semibold text-black text-[14px] text-justify'>{item.title.slice(0, 55) + "..."}</Text>
                  <Text className='font-poppins_medium text-justify text-black text-[10px]'>{item.desc.slice(0, 124) + "..."}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>          
        </ScrollView>
    </CustomSafeAreaView>
  )
}
