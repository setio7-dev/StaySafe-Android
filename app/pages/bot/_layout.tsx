import { Tabs } from "expo-router";
import "@/global.css";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function BootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
       <Tabs
          screenOptions={{
            headerShown: false,
            animation: "fade",
            tabBarActiveTintColor: "#1D4ED8",   
            tabBarInactiveTintColor: "#9CA3AF", 
            tabBarHideOnKeyboard: true,
            tabBarStyle: {          
              backgroundColor: "#FFFFFF",       
              borderTopWidth: 0.5,
              borderTopColor: "#E5E7EB",
              paddingTop: 10,
              paddingBottom: insets.bottom + 10,
              height: 70 + insets.bottom, 
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "600",
              fontFamily: "poppins_medium"
            },
          }}
        >
          <Tabs.Screen
            name="talk"
            options={{
              title: "Bicara",
              tabBarIcon: ({ color }) => (
                <Ionicons name="mic-outline" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="chat"
            options={{
              title: "Pesan",
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbox-ellipses-outline" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="mood"
            options={{
              title: "Deteksi Perasaan",
              tabBarIcon: ({ color }) => (
                <Ionicons name="happy-outline" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
    </View>
  )
}
