/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import useAuthHook from './authHook';
import { useRouter } from 'expo-router';
import { PickImage } from '../utils/pickImage';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Keyboard } from 'react-native';

export default function useConsultationHook() {
    const [doctor, setDoctor] = useState<doctorProps[]>([]);
    const [myDoctor, setMyDoctor] = useState<conversationProps[]>([]);
    const [conversationSingle, setConversationSingle] = useState<conversationProps | null>(null);
    const [idState, setIdState] = useState<any>(null);
    const [search, setSearch] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [image, setImage] = useState<any>(null);
    const navigate = useRouter();
    const { user } = useAuthHook();
    const { showActionSheetWithOptions } = useActionSheet();
    const [sheetOverlay, setSheetOverlay] = useState<boolean>(false);    

    const fetchSingleConversation = async () => {
        try {
            const { data } = await SupabaseAPI.from("conversation").select(`*, sender(*), receiver(*), message(*, sender(*))`).eq("id", idState).order("created_at", { ascending: false }).single();
            setConversationSingle(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchSingleConversation();
        const channel = SupabaseAPI
            .channel("realtime:message")
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "message",
                    filter: `conversation_id=eq.${idState}`,
                },
                (payload) => {
                    const deletedId = payload.old?.id;
                    if (!deletedId) return;

                    setConversationSingle((prev: any) => {
                        if (!prev) return prev;

                        return {
                            ...prev,
                            message: prev.message?.filter(
                                (item: any) => item.id !== deletedId
                            ),
                        };
                    });
                }
            )
            .subscribe();

        return () => {
            SupabaseAPI.removeChannel(channel);
        };
    }, [idState]);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const { data } = await SupabaseAPI.from("doctor").select(`*, user_id(*)`);
                if (search) {
                    const dataFilter = data?.filter((item: doctorProps) => {
                        const filter = item.user_id.name.toLowerCase().includes(search.toLowerCase());
                        return filter;
                    });

                    setDoctor(dataFilter as any);
                } else {
                    setDoctor(data as any);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchDoctor();
        fetchSingleConversation();
    }, [search, idState]);
    
    const fetchMyDoctor = async () => {
        try {
            const { data } = await SupabaseAPI.from("conversation").select(`*, receiver(*), message(*, sender(*))`).eq("sender", user?.id).order("created_at", { ascending: false });
            setMyDoctor(data as any);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchMyDoctor();
    }, [user?.id]);    

    const handlePostConversation = async (receiverId: number) => {
        try {
            const { data: checkConversation } = await SupabaseAPI.from("conversation").select().eq("receiver", receiverId).single();
            if (checkConversation) {
                navigate.push({ pathname: "/pages/consultation/consultationmessage", params: { id: checkConversation.id } })
                return;
            }

            const { data: newConversation } = await SupabaseAPI.from("conversation").insert([
                {
                    sender: user?.id,
                    receiver: receiverId
                }
            ]).select().single()

            navigate.push({ pathname: "/pages/consultation/consultationmessage", params: { id: newConversation?.id } });
            return;
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        }
    }

    const handlePickImage = async () => {
        const uri = await PickImage();
        setImage(uri);
    }

    const handleUnPickImage = () => {
        setImage(null);
    }

    const handlePostMessage = async (sender: number) => {
        try {
            let uploadImage;
            if (message === "") {
                ToastMessage({
                    type: "error",
                    text: "Pesan Wajib Diisi!"
                });
                return;
            }

            if (image) {
                const formData = new FormData();
                formData.append("upload_preset", "staysafe");
                formData.append("folder", "consultation");
                formData.append("file", {
                    uri: image,
                    name: `consultation${Date.now()}.jpg`,
                    type: "image/jpeg",
                } as any);

                const uploadImageCloudinary = await fetch("https://api.cloudinary.com/v1_1/df9dwfg8r/image/upload", {
                    method: "POST",
                    body: formData
                });

                const imageJson = await uploadImageCloudinary.json();
                uploadImage = imageJson.secure_url;
            }

            await SupabaseAPI.from("message").insert([
                {
                    conversation_id: idState,
                    image: uploadImage,
                    message,
                    sender: sender
                }
            ]);

            Keyboard.dismiss();
            setMessage("");
            setImage("");
            fetchSingleConversation();
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        }
    }

    const handleDeleteMessage = async (messageId: number) => {
        try {
            const { error } = await SupabaseAPI.from("message").delete().eq("id", messageId);
            if (error) {
                ToastMessage({
                    text: "Gagal Menghapus Pesan!",
                    type: "error"
                });
                return;
            }

            ToastMessage({
                type: "success",
                text: "Hapus Pesan Berhasil"
            });

            fetchSingleConversation();
        } catch (error) {
            console.error(error);
            ToastMessage({
                text: "Gagal Menghapus Pesan!",
                type: "error"
            });
        }
    }

    const handleShowDelete = (userId: number, itemId: number) => {
        if (userId !== user?.id) return;
        setSheetOverlay(true);

        showActionSheetWithOptions(
            {
                options: ['Hapus Pesan', 'Batal'],
                destructiveButtonIndex: 0,
                cancelButtonIndex: 1,
            },
            (buttonIndex) => {
                setSheetOverlay(false)
                if (buttonIndex === 0) {
                    handleDeleteMessage(itemId);
                }
            }
        )
    }

    return {
        doctor,
        myDoctor,
        search,
        setSearch,
        handlePostConversation,
        setIdState,
        conversationSingle,
        handlePickImage,
        handleUnPickImage,
        image,
        user,
        handlePostMessage,
        message,
        setMessage,
        sheetOverlay,
        handleShowDelete,
        fetchMyDoctor
    }
}
