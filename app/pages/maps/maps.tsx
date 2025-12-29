import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview';
import userImage from "@/assets/images/maps/user.png";
import dangerImage from "@/assets/images/maps/danger.png";
import positionImage from "@/assets/images/maps/position.png";
import useMapsHooks from '@/app/hooks/mapsHooks';
import Loader from '@/app/utils/loader';

export default function Maps() {
    const { generateMapHTML, location, icons, myLocation } = useMapsHooks();
    if (!location || !icons) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
    return (
        <CustomSafeAreaView className='relative'>
            <BackPage type={false} title='Pantau Sekitar' />
            <WebView
                className='-translate-y-4'
                originWhitelist={['*']}
                source={{
                    html: generateMapHTML(location?.lat, location?.lng, icons),
                }}
                style={{ flex: 1 }}
                scalesPageToFit={false}
                javaScriptEnabled
            />  
            <View className='flex flex-col bg-white px-6 pt-8 pb-20 absolute bottom-0 w-full rounded-t-lg'>
                <ScrollView>
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
                </ScrollView>
            </View>
        </CustomSafeAreaView>
    )
}
