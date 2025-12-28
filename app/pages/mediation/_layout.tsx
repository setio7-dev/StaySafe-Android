import { Stack } from "expo-router";
import "@/global.css";

export default function MediationLayout() {
  return <Stack screenOptions={{
    headerShown: false,
    animation: "fade"
  }} />;
}
