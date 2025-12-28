import CustomSafeAreaView from '@/app/ui/safeAreaView'
import PrimaryGradient from '@/app/utils/primaryGradient'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import back from "@/assets/images/icon/back.png"
import { useLocalSearchParams, useRouter } from 'expo-router'
import useCommunityHook from '@/app/hooks/communityHook'
import Loader from '@/app/utils/loader'
import guest from "@/assets/images/home/guest.png"
import send from "@/assets/images/community/send.png"
import upload from "@/assets/images/icon/upload.png"
import { TimeAgo } from '@/app/utils/timeAgo'
import ImageViewing from 'react-native-image-viewing'

export default function CommunityDetail() {
    const { id } = useLocalSearchParams();
    const { setCommunitiesId, singleCommunity, follower, post, user, setMessage, message, handlePostMessage, handlePickImage, image, handleUnPickImage, sheetOverlay, handleShowDelete } = useCommunityHook();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useRouter();

    useEffect(() => {
        setCommunitiesId(id);
    }, [setCommunitiesId, id]);

    if (!singleCommunity) {
        return <Loader fullScreen={true} text='Memuat...' />
    }
    return (
        <CustomSafeAreaView platform='height' avoiding={-40}>
            <PrimaryGradient className='px-6 py-8' roundedBottom={12}>
                <View className='flex flex-row gap-2 items-center'>
                    <TouchableOpacity onPress={() => navigate.back()}>
                        <Image source={back} className='w-8 h-8' />
                    </TouchableOpacity>
                    <View className='flex flex-row gap-4 items-center'>
                        <Image source={{ uri: singleCommunity?.image }} className='w-14 h-14 rounded-full border-[1px] border-white' />
                        <View className='flex flex-col'>
                            <Text className='text-white font-poppins_semibold text-[14px]'>{singleCommunity?.name}</Text>
                            <Text className='text-white font-poppins_medium text-[12px]'>{follower + " Pengikut"}</Text>
                        </View>
                    </View>
                </View>
            </PrimaryGradient>
            <ScrollView className='pt-12' style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
                <View className='flex flex-col px-6 gap-8'>
                    {post.length > 0 ? (
                        post.map((item, index) => (
                            <TouchableOpacity onLongPress={() => handleShowDelete(item.user_id.id, item.id)} key={index} className='bg-white elevation-sm rounded-lg p-6'>
                                <View className='flex flex-row items-center gap-4'>
                                    {item.user_id.image ? (
                                        <Image source={{ uri: item.user_id.image }} className='w-12 h-12 rounded-full' />
                                    ) : (
                                        <Image source={guest} className='w-12 h-12 rounded-full border-2 border-primary' />
                                    )}
                                    <View className='flex flex-col'>
                                        <Text className='font-poppins_semibold text-black text-[14px]'>{item.user_id.id === user?.id ? 'Anda' : item.user_id.name}</Text>
                                        <Text className='font-poppins_medium text-gray text-[10px]'>{TimeAgo(item.created_at)}</Text>
                                    </View>
                                </View>
                                <View className='mt-6'>
                                    {item.image && (
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => {
                                                setPreviewImage(item.image)
                                                setPreviewVisible(true)
                                            }}
                                        >
                                            <Image
                                                source={{ uri: item.image }}
                                                resizeMode='cover'
                                                className='w-full h-[400px] rounded-lg'
                                            />
                                        </TouchableOpacity>
                                    )}
                                    <Text className={`text-justify font-poppins_medium text-black text-[12px] ${item.image ? 'mt-6' : 'mt-0'}`}>{item.message}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text></Text>
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
                        <TextInput multiline value={message} onChangeText={(e) => setMessage(e)} className='font-poppins_medium text-black text-[12px] flex-1' placeholder='Kirim Pesanmu...' placeholderTextColor="#ACACAC" />
                    </View>
                    <TouchableOpacity onPress={() => handlePostMessage(id)}>
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
