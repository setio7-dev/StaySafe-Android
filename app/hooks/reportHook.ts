/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuthHook from "./authHook";
import { PickImage } from "../utils/pickImage";
import ToastMessage from "../utils/toastMessage";
import { translateError } from "../utils/translateError";
import { SupabaseAPI } from "../server/supabase";

export default function useReportHook() {
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [image, setImage] = useState<any>("");
    const [location, setLocation] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [report, setReport] = useState<reportProps[]>([]);
    const { user } = useAuthHook();

    const handlePickImage = async () => {
        const uri = await PickImage();
        setImage(uri);
    }

    const fetchReport = async() => {
        try {
            const { data } = await SupabaseAPI.from("report").select().eq("user_id", user?.id);
            setReport(data as any);
        } catch (error: any) {
            ToastMessage({
                text: error.message,
                type: "error"
            })
        }
    }

    useEffect(() => {
        fetchReport();
    }, [user]);

    const handlePostReport = async () => {
        try {
            setIsLoading(true);
            let uploadImage;

            if (!title || !image || !desc || !location) {
                ToastMessage({
                    type: "error",
                    text: "Kolom Harus Diisi!"
                });

                return;
            }

            const formData = new FormData();
            formData.append("upload_preset", "staysafe");
            formData.append("folder", "/report");
            formData.append("file", {
                uri: image,
                type: "image/jpeg",
                name: `report${Date.now()}.jpg`
            } as any);

            const uploadedImageCloudinary = await fetch(`https://api.cloudinary.com/v1_1/df9dwfg8r/image/upload`, {
                method: "POST",
                body: formData
            });

            const resFromCloudinary = await uploadedImageCloudinary.json();
            uploadImage = resFromCloudinary.secure_url;

            const { error } = await SupabaseAPI.from("report").insert([
                {
                    title,
                    user_id: user?.id,
                    desc,
                    status: "menunggu",
                    image: uploadImage,
                    location
                }
            ]);

            if (error) {
                ToastMessage({
                    type: "error",
                    text: translateError(error.message)
                })    
            }

            ToastMessage({
                type: "success",
                text: "Laporan Berhasil Dikirim!"
            });
            
            setTitle("");
            setDesc("");
            setImage("");
            setLocation("");
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handlePickImage,
        handlePostReport,
        title,
        setTitle,
        desc,
        setDesc,
        location,
        setLocation,
        image,
        isLoading,
        report,
        user,
        fetchReport
    }
}
