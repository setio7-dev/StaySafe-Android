import React, { useEffect } from 'react'
import CustomSafeAreaView from '@/app/ui/safeAreaView';
import logo from "@/assets/logo/logo.png";
import { Image } from "react-native";
import { useRouter } from 'expo-router';
import useAuthHook from './hooks/authHook';
import * as ExpoSplashScreen from 'expo-splash-screen';

export default function SplashScreen() {
  const navigate = useRouter();
  const { user } = useAuthHook();
  useEffect(() => {
    const handleNavigate = async () => {
      ExpoSplashScreen.preventAutoHideAsync();
      ExpoSplashScreen.hideAsync();
      
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (user) {
        navigate.replace("/pages/home/home");
      } else {
        navigate.replace("/pages/auth/login");
      }
    }

    handleNavigate();
  }, [navigate, user]);
  return (
    <CustomSafeAreaView className="justify-center items-center bg-primary">
      <Image source={logo} className='w-60 h-60' />
    </CustomSafeAreaView>
  )
}
