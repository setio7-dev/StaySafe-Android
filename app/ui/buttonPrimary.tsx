import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient"
import Loader from '../utils/loader';

interface buttonPrimaryProps {
    type: "primary" | "secondary" | "gradient";
    onClick?: () => void;
    text: string;
    widthFull?: boolean;
    className?: string;
    rounded?: number;
    width?: number;
    loading?: boolean;
    textSize?: number;
    padding?: number;
}

export default function ButtonPrimary({ type, onClick, text, widthFull, className, rounded = 8, width = 140, loading = false, textSize = 16, padding = 14 }: buttonPrimaryProps) {
  return (
    type === "gradient" ? (
        !loading ? (
          <LinearGradient colors={["#1D4ED8", "#137DD3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: rounded, width: widthFull ? '100%' : width }} className={className}>
            <TouchableOpacity onPress={onClick} className=' flex justify-center items-center' style={{ padding: padding }}>
              <Text className='font-poppins_medium text-white' style={{ fontSize: textSize }}>{text}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <View className={className}>
            <Loader/>
          </View>
        )
    ) : (
        !loading ? (
          <TouchableOpacity onPress={onClick} className={`${type === "primary" ? 'bg-primary' : 'bg-secondary'} ${className} flex justify-center items-center`} style={{ borderRadius: rounded, width: widthFull ? '100%' : width, padding: padding }}>
              <Text className='font-poppins_medium text-white' style={{ fontSize: textSize }}>{text}</Text>
          </TouchableOpacity>
        ) : (
          <View className={className}>
            <Loader/>
          </View>
        )
    )
  )
}
