import React from 'react'
import { TextInput } from 'react-native'

interface searchPrimaryProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function SearchPrimary({ value, onChange, className }: searchPrimaryProps) {
  return (
    <TextInput value={value} onChangeText={onChange} className={`bg-white font-poppins_regular text-black rounded-md text-[12px] py-4 px-4 ${className}`} placeholder='Cari sesuatu...' placeholderTextColor="#ACACAC"/>
  )
}
