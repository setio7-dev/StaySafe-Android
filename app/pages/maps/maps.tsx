import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import { View } from 'react-native'
import { WebView } from 'react-native-webview';
import userImage from "@/assets/images/maps/user.png";
import dangerImage from "@/assets/images/maps/danger.png";
import positionImage from "@/assets/images/maps/position.png";
import useMapsHooks from '@/app/hooks/mapsHooks';
import Loader from '@/app/utils/loader';

export default function Maps() {
    const { generateMapHTML, location, icons } = useMapsHooks();
    if (!location || !icons) {
        return <Loader fullScreen={true} text='Memuat...'/>
    }
    return (
        <CustomSafeAreaView>
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
        </CustomSafeAreaView>
    )
}
