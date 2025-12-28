import useConsultationHook from '@/app/hooks/consultationHook';
import CustomSafeAreaView from '@/app/ui/safeAreaView';
import PrimaryGradient from '@/app/utils/primaryGradient';
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import upload from "@/assets/images/icon/upload.png"
import back from "@/assets/images/icon/back.png"
import guest from "@/assets/images/home/guest.png"
import send from "@/assets/images/community/send.png"
import left from "@/assets/images/consultation/left.png"
import right from "@/assets/images/consultation/right.png"
import Loader from '@/app/utils/loader';
import ImageViewing from 'react-native-image-viewing'

export default function ConsultationMessage() {
  const { id } = useLocalSearchParams();
  const { setIdState, conversationSingle, handlePickImage, handleUnPickImage, image, user, message, setMessage, handlePostMessage, sheetOverlay, handleShowDelete } = useConsultationHook();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useRouter();

  useEffect(() => {
    setIdState(id);
  }, [setIdState, id]);

  if (!conversationSingle || !user) {
    return <Loader fullScreen={true} text='Memuat...'/>
  }
  return (
    <CustomSafeAreaView avoiding={-40}>
        <PrimaryGradient className='px-6 py-8' roundedBottom={12}>
            <View className='flex flex-row gap-2 items-center'>
                <TouchableOpacity onPress={() => navigate.back()}>
                    <Image source={back} className='w-8 h-8' />
                </TouchableOpacity>
                <View className='flex flex-row gap-4 items-center'>
                    <Image source={{ uri: conversationSingle?.receiver?.image }} className='w-14 h-14 rounded-full border-[1px] border-white' />
                    <View className='flex flex-col'>
                        <Text className='text-white font-poppins_semibold text-[14px]'>{conversationSingle?.receiver?.name}</Text>
                        <Text className='text-white font-poppins_medium text-[12px]'>Online</Text>
                    </View>
                </View>
            </View>
        </PrimaryGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 40 }}>
          <View className='flex flex-col gap-8 px-6'>
            {conversationSingle!.message?.length > 0 ? (
              conversationSingle?.message.map((item, index) => (
                <TouchableOpacity onLongPress={() => handleShowDelete(item.sender.id, item.id)} key={index} className={`flex justify-end ${item.sender.id === user.id ? 'flex-row' : 'flex-row-reverse'}`}>
                  <View className='flex flex-row'>
                    <PrimaryGradient className='p-4' roundedBottom={12} roundedTop={12}>
                      {item.image && (
                        <TouchableOpacity 
                          activeOpacity={0.9} 
                          onPress={() => {
                            setPreviewImage(item.image)
                            setPreviewVisible(true)
                          }}>
                          <Image source={{ uri: item.image }} className='w-[200px] h-[240px] rounded-lg mb-4'/>
                        </TouchableOpacity>
                      )}
                      <Text className='font-poppins_medium text-white text-[12px]'>{item.message}</Text>
                    </PrimaryGradient>
                    <Image source={{ uri: item.sender.image }}/>
                  </View>
                  {item.sender.id === user.id ? (
                    <Image source={right} className='w-6 h-6 -translate-x-3'/>
                  ) : (
                    <Image source={left} className='w-6 h-6 translate-x-3'/>
                  )}
                  {item.sender.image ? (
                    <Image source={{ uri: item.sender.image }} className='w-12 h-12 rounded-full'/>
                  ) : (
                    <Image source={guest} className='w-12 h-12'/>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text className='bg-secondary text-center p-2 rounded-lg font-poppins_medium text-white w-[180px] py-2 mx-auto text-[12px]'>Belum Ada Percakapan</Text>
            )}
          </View>
        </ScrollView>
        <View className='mb-10 bg-white px-6 py-4 flex flex-col gap-4'>
            {image && (
                <View className='w-20 h-20 relative'>
                    <TouchableOpacity className='-right-2 -top-2 absolute z-30' onPress={() => handleUnPickImage()}>
                        <Text className='px-2.5 bg-red font-poppins_semibold text-[14px] rounded-full text-white'>x</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: image }} className='w-full h-full rounded-lg' />
                </View>
            )}
            <View className='items-center flex w-full justify-between flex-row gap-4'>
                <View className='flex flex-row items-center gap-2 flex-1 bg-white px-4 py-1 rounded-lg border-[1px] border-gray'>
                    <TouchableOpacity onPress={() => handlePickImage()}>
                        <Image source={upload} resizeMode='contain' className='w-7 h-7' />
                    </TouchableOpacity>
                    <TextInput value={message} onChangeText={(e) => setMessage(e)} multiline className='font-poppins_medium text-black text-[12px] flex-1' placeholder='Kirim Pesanmu...' placeholderTextColor="#ACACAC" />
                </View>
                <TouchableOpacity onPress={() => handlePostMessage(user.id)}>
                    <Image source={send} resizeMode='contain' className='w-14 h-14' />
                </TouchableOpacity>
            </View>
        </View>
        {sheetOverlay && (
          <View className="absolute inset-0 z-40 bg-black/40" />
        )}
        <ImageViewing
            images={previewImage ? [{ uri: previewImage }] : []}
            imageIndex={0}
            visible={previewVisible}
            onRequestClose={() => setPreviewVisible(false)}
        />
    </CustomSafeAreaView>
  )
}
