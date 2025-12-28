import Toast from "react-native-toast-message";

interface toastMessageProps {
    type: "success" | "error";
    text: string;
}

export default function ToastMessage({ type, text }: toastMessageProps) {
    Toast.show({
        type: type,
        text1: type === "success" ? "Berhasil!" : "Gagal!",
        text2: text,
        position: 'bottom',
    })
}
