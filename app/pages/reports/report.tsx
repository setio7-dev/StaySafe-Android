import useReportHook from '@/app/hooks/reportHook'
import BackPage from '@/app/ui/backPage'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import FormInput from '@/app/ui/formInput'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function Report() {
  const { handlePickImage, handlePostReport, title, desc, image, location, setTitle, setDesc, setLocation, isLoading } = useReportHook();
  return (
    <CustomSafeAreaView>
      <BackPage type={false} title='Laporan' />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className='flex flex-col gap-2 mt-8'>
          <Text className="text-black text-center font-poppins_semibold text-[20px]">Buat Laporan Anda</Text>
          <Text className="text-black font-poppins_medium text-[12px] text-center">Sampaikan laporan atau keluhan Anda{'\n'} dengan jelas dan lengkap</Text>
        </View>
        <View className='flex flex-col gap-8 mt-8 px-6'>
          <FormInput value={title} onChange={(e) => setTitle(e)} text='Kejadian' placeholder='Kejadian yang ingin anda laporkan...' />
          <FormInput value={desc} onChange={(e) => setDesc(e)} multiline={true} text='Deskripsi' placeholder='Deskripsi Kejadian...' />
          {image ? (
            <TouchableOpacity className='w-full h-[300px]' onPress={() => handlePickImage()}>
              <Image source={{ uri: image }} className='w-full h-full rounded-lg'/>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handlePickImage()}>
              <FormInput file={true} text='Gambar yang didukung .png .jpg .jpeg'/>
            </TouchableOpacity>
          )}
          <FormInput value={location} onChange={(e) => setLocation(e)} multiline={true} text='Lokasi' placeholder='Lokasi Kejadian...' />
          <ButtonPrimary loading={isLoading} onClick={() => handlePostReport()} className='mt-2' type='gradient' text='Kirim' padding={14} widthFull/>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  )
}
