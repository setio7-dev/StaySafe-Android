import "@/global.css";
import { useFonts } from "expo-font";
import React from "react";
import { View } from "react-native";

interface fontLoadedProps {
    children: React.ReactNode;
}

export default function FontLoadedProps({ children }: fontLoadedProps) {
  const [isFontLoaded] = useFonts({
    poppins_regular: require("@/assets/font/Poppins-Regular.ttf"),
    poppins_medium: require("@/assets/font/Poppins-Medium.ttf"),
    poppins_semibold: require("@/assets/font/Poppins-SemiBold.ttf"),
  });

  if (!isFontLoaded) return null;

  return (
    <View className="flex-1">
        {children}
    </View>
  );
}
