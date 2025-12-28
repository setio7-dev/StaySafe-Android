import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native'
import logo from "@/assets/logo/logo-text.png";
import circle from "@/assets/images/auth/circle.png";
import FormInput from '@/app/ui/formInput';
import ButtonPrimary from '@/app/ui/buttonPrimary';
import useAuthHook from '@/app/hooks/authHook';
import { Link } from 'expo-router';

export default function Login() {
  const { email, setEmail, password, setPassword, handleLogin, isLoading } = useAuthHook();
  return (
    <CustomSafeAreaView className='bg-white' platform='padding' avoiding={30}>
        <ScrollView>
            <ImageBackground source={circle} resizeMode='cover' className='flex flex-col justify-center gap-4 px-6 pt-10 pb-12'>
                <Image source={logo} className='w-[180px] h-[70px]' resizeMode="contain"/>
                <Text className='text-white text-[26px] font-poppins_semibold'>Silahkan Masuk ke {"\n"}Akun Anda</Text>
                <Text className='text-white text-[12px] font-poppins_medium'>Masukkan email dan kata sandi {"\n"}anda untuk masuk</Text>
            </ImageBackground>
            <View className='w-full flex-col gap-8 px-4 mt-10 items-center'>
              <FormInput text='Email' value={email} onChange={(e) => setEmail(e)} placeholder='Masukkan Email Anda!' />
              <FormInput textSecure={true} text='Kata Sandi' value={password} onChange={(e) => setPassword(e)} placeholder='Masukkan Kata Sandi Anda!' />
              <ButtonPrimary loading={isLoading} onClick={() => handleLogin()} text='Masuk' rounded={10} className='mt-8' type='gradient' widthFull/>
              <Text className='font-poppins_medium text-black text-[14px] mt-8'>Belum punya akun?
                <Link href="/pages/auth/register">
                  <Text className='text-primary font-poppins_semibold'> Daftar</Text>
                </Link>
              </Text>
            </View>
        </ScrollView>
    </CustomSafeAreaView>
  )
}
