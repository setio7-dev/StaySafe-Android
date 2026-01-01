import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import { Image, ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native'
import { WebView } from 'react-native-webview';
import userImage from "@/assets/images/maps/user.png";
import dangerImage from "@/assets/images/maps/danger.png";
import useMapsHooks from '@/app/hooks/mapsHooks';
import Loader from '@/app/utils/loader';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Maps() {
    const { location, myLocation, panResponder, suggestionPlace, heightAnim, handleGoToPlace, webViewRef, fetchZones, handleMessageDistance, isWarningRef, fetchMaps, mapHTML } = useMapsHooks();
    useFocusEffect(
        useCallback(() => {
            fetchZones()
            fetchMaps()
        }, [fetchZones, fetchMaps])
    )

    if (!location || !suggestionPlace) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
    return (
        <CustomSafeAreaView className='relative'>
            <BackPage type={false} title='Pantau Sekitar' />
            <WebView
                className='-translate-y-4'
                ref={webViewRef}
                originWhitelist={['*']}
                source={{
                    html: mapHTML,
                }}
                style={{ flex: 1 }}
                scalesPageToFit={false}
                javaScriptEnabled
                onMessage={(event) => handleMessageDistance(event)}
            />              
            <Animated.View {...panResponder.panHandlers} className='flex flex-col bg-white px-6 py-8 absolute bottom-0 w-full rounded-t-lg' style={{ height: heightAnim, }}>
                <View className='flex flex-col items-center justify-center gap-6'>
                    <TouchableOpacity className='mx-auto'>
                        <View className='w-[80px] bg-primary rounded-full h-[6px]'/>
                    </TouchableOpacity>
                    <Text className='text-primary text-[20px] font-poppins_semibold text-center'>Lokasi Kamu</Text>
                </View>
                <View className='flex flex-row gap-6 items-center mt-6'>
                    <Image source={userImage} className='w-8 h-8'/>
                    <Text className='font-poppins_medium text-black text-[12px] flex-1 text-justify'>{myLocation}</Text>
                </View>
                {isWarningRef.current && (
                    <View className='bg-red/30 border-2 rounded-lg border-red p-4 mt-6 flex flex-row gap-4 justify-center items-center'>
                        <Image source={dangerImage} className='w-20 h-20'/>
                        <View className='flex flex-col flex-1'>
                            <Text className='text-red font-poppins_semibold text-[16px]'>Harap Waspada!</Text>
                            <Text className='text-red font-poppins_medium text-[10px] text-justify'>Anda berada di area berisiko, segera tingkatkan kewaspadaan untuk menjaga keselamatan.</Text>
                        </View>
                    </View>
                )}
                <ScrollView horizontal className='mt-6'>
                    <View className='flex flex-row gap-4'>
                        {suggestionPlace.map((item, index) => (
                            <TouchableOpacity onPress={() => handleGoToPlace(item.properties.lat, item.properties.lon, item.properties.name)} key={index} className='bg-white p-4 border-2 border-secondary rounded-lg w-[280px] h-[140px]'>
                                <Text className='text-black font-poppins_semibold text-[14px]'>Lokasi: {item.properties.name}</Text>
                                <Text className='text-black font-poppins_medium text-[12px]'>Alamat: {item.properties.formatted}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>
        </CustomSafeAreaView>
    )
}
