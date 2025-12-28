import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React, { useEffect } from 'react'
import BackPage from '@/app/ui/backPage'
import { useLocalSearchParams } from 'expo-router'
import { Image, ScrollView, Text, View } from 'react-native';
import useNewsHook from '@/app/hooks/newsHook';
import { formatDate } from '@/app/utils/formatDate';
import Loader from '@/app/utils/loader';

export default function NewsDetail() {    
    const { id } = useLocalSearchParams();
    const { setIdState, newsSingle } = useNewsHook();

    useEffect(() => {
        setIdState(id);
    }, [id, setIdState]);

    if (!newsSingle) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
  return (
    <CustomSafeAreaView>
        <BackPage/>
        <ScrollView className='pt-10 px-6' contentContainerStyle={{ paddingBottom: 140 }}>
            <View className='w-full flex-col gap-2'>
                <Text className='text-black text-justify font-poppins_semibold text-[17px]'>{newsSingle?.title}</Text>
                {newsSingle?.created_at && (
                    <Text className='text-black font-poppins_medium text-[12px]'>{formatDate(newsSingle?.created_at)}</Text>
                )}
            </View>
            <Image source={{ uri: newsSingle?.image }} className='w-full h-[240px] rounded-lg my-6'/>
            <Text className='text-justify font-poppins_medium text-black text-[12px]'>{newsSingle?.detail}</Text>
        </ScrollView>
    </CustomSafeAreaView>
  )
}
