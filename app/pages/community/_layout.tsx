import { Stack } from "expo-router";
import "@/global.css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function CommunityLayout() {
  return (
    <ActionSheetProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </ActionSheetProvider>
  );
}
