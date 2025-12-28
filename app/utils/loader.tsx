import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoaderProps {
  text?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export default function Loader({
  text = "",
  size = "large",
  fullScreen = false,
}: LoaderProps) {
  return (
    <View
      className={`${
        fullScreen ? "flex-1" : ""
      } justify-center items-center`}
    >
      <ActivityIndicator size={size === "large" ? 50 : 40} color="#1D4ED8" />
      {text && (
        <Text className="mt-3 text-sm font-poppins_medium text-primary">
          {text}
        </Text>
      )}
    </View>
  );
}
