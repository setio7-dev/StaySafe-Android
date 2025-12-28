import React from 'react'
import { View, TextInput, Text, Image } from 'react-native'
import upload from "@/assets/images/icon/upload-file.png"

interface formInputProps {
    text: string;
    onChange?: (value: string) => void;
    value?: string;
    placeholder?: string;
    textSecure?: boolean;
    multiline?: boolean;
    file?: boolean;
}

export default function FormInput({ text, onChange, value, placeholder, textSecure=false, multiline=false, file=false }: formInputProps) {
  return (
    file ? (
      <View className='flex flex-col w-full py-12 mt-4 rounded-lg border-primary border-2 border-dashed justify-center items-center gap-6'>
        <Image source={upload} className='w-14 h-14'/>
        <View className='bg-secondary rounded-full' style={{ paddingVertical: 10, paddingHorizontal: 36 }}>
          <Text className='text-white font-poppins_medium'>Pilih File</Text>
        </View>
        <Text className='text-black font-poppins_medium text-[12px]'>{text}</Text>
      </View> 
    ) : (
      <View className='h-auto w-full flex-col gap-2 group'>
          <Text className='text-black font-poppins_semibold text-[14px] group-focus:text-secondary'>{text}</Text>
          <TextInput multiline={multiline} secureTextEntry={textSecure} value={value} onChangeText={onChange} className='w-full text-black px-4 border-gray border-2 group-focus:border-secondary rounded-xl font-poppins_medium py-4 text-[12px]' placeholder={placeholder} placeholderTextColor="#ACACAC" />
      </View>
    )
  )
}
