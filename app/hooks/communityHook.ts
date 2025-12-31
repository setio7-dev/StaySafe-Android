/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { SupabaseAPI } from '../server/supabase';
import useAuthHook from './authHook';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import { useRouter } from 'expo-router';
import { PickImage } from '../utils/pickImage';
import { Keyboard } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet'

export default function useCommunityHook() {
    const [community, setCommunity] = useState<communityProps[]>([]);
    const [myCommunity, setMyCommunity] = useState<communityMemberProps[]>([]);
    const [post, setPost] = useState<communityPostProps[]>([]);
    const [singleCommunity, setSingleCommunity] = useState<communityProps | null>(null);
    const [communitiesId, setCommunitiesId] = useState<any>(null);
    const [search, setSearch] = useState<any>("");
    const [isLoading, setIsLoading] = useState<number | null>(null);
    const { user } = useAuthHook();
    const [follower, setFollower] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const [sheetOverlay, setSheetOverlay] = useState<boolean>(false);
    const navigate = useRouter();    

    useEffect(() => {
        const subscription = SupabaseAPI
            .channel('public:communities')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'communities' }, (payload: any) => {
                setCommunity(prev => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'communities' }, (payload: any) => {
                setCommunity(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'communities' }, (payload) => {
                setCommunity(prev => prev.filter(item => item.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            SupabaseAPI.removeChannel(subscription);
        };
    }, []);

    useEffect(() => {
        const subscription = SupabaseAPI
            .channel('public:communities_post') 
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'communities_post' }, (payload: any) => {
                setPost(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'communities_post' }, (payload) => {
                setPost(prev => prev.filter(item => item.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            SupabaseAPI.removeChannel(subscription);
        };
    }, [communitiesId]);

    const fetchCommunityPost = async() => {
        try {
            const { data } = await SupabaseAPI.from("communities_post").select(`*, user_id(*)`).eq("community_id", communitiesId).order("created_at", { ascending: true });
            setPost(data as any);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCommunityMember = async() => {
        try {
            if (!user) return;
            const { data } = await SupabaseAPI.from("communities_member").select(`*, community_id(*)`).eq("user_id", user?.id).order("created_at", { ascending: false });
            setMyCommunity(data as any);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCommunity = async() => {
        try {
            const { data }  = await SupabaseAPI.from("communities").select().order("created_at", { ascending: false });
            if (search) {
                const dataFilter = data?.filter((item: any) => {
                    const filter = item.name.toLowerCase().includes(search.toLowerCase());
                    return filter;
                });

                setCommunity(dataFilter as any);
            } else {
                setCommunity(data as any);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSingleCommunity = async() => {
        try {
            const { data }  = await SupabaseAPI.from("communities").select().eq("id", communitiesId).single();
            const { data: communityMember } = await SupabaseAPI.from("communities_member").select().eq("community_id", communitiesId);

            const userCount = communityMember?.length;
            setFollower(userCount as any);
            setSingleCommunity(data);
        } catch (error) {
            console.error(error);
        }
    }   

    useEffect(() => {
        fetchCommunity();
        fetchSingleCommunity();
        fetchCommunityPost();
        fetchCommunityMember();
    }, [search, communitiesId, user]);

    const handleJoinCommunity = async(communityId: number) => {
        try {
            setIsLoading(communityId);
            const { data: checkCommunity } = await SupabaseAPI.from("communities_member").select().eq("user_id", user?.id).eq("community_id", communityId).maybeSingle();
            if (checkCommunity) {
                navigate.push({ pathname: "/pages/community/communityDetail", params: { id: communityId } });
                return;
            }
            
            await SupabaseAPI.from("communities_member").insert([
                {
                    community_id: communityId,
                    user_id: user?.id
                }
            ]);

            ToastMessage({
                text: "Pengguna Berhasil Bergabung",
                type: "success"
            });

            setTimeout(() => {
                navigate.push({ pathname: "/pages/community/communityDetail", params: { id: communityId } });
            }, 3000);
        } catch (error: any) {
            ToastMessage({
                text: translateError(error.message),
                type: "error"
            });
        } finally {
            setIsLoading(null);
        }
    }

    const handlePickImage = async() => {
        const uri = await PickImage();
        if (uri) return setImage(uri);
    }

    const handleUnPickImage = async() => {
        setImage(null);
    }

    const handlePostMessage = async(communityId: any) => {
        try {
            if (!message) {
                ToastMessage({
                    text: "Pesan Tidak Boleh Kosong!",
                    type: "error"
                });
                return;
            }

            let uploadImage;
            if (image) {
                const formData = new FormData();
                formData.append("upload_preset", "staysafe");
                formData.append("folder", "community/post");
                formData.append("file", {
                    uri: image,
                    name: `community_post${Date.now()}.jpg`,
                    type: "image/jpeg",
                } as any);

                const uploadImageCloudinary = await fetch(`https://api.cloudinary.com/v1_1/df9dwfg8r/image/upload`, {
                    method: "POST",
                    body: formData
                });

                const res = await uploadImageCloudinary.json();
                uploadImage = res.secure_url;
            }

            const { error } = await SupabaseAPI.from("communities_post").insert([
                {
                    user_id: user?.id,
                    message,
                    community_id: communityId,
                    image: uploadImage ? uploadImage : null
                    
                }
            ]);

            if (error) {
                ToastMessage({
                    text: "Gagal Mengirim Pesan!",
                    type: "error"
                });
            }

            Keyboard.dismiss();
            setImage(null);
            setMessage("");
            fetchCommunityPost();
        } catch (error) {
            console.error(error);
            ToastMessage({
                text: "Gagal Mengirim Pesan!",
                type: "error"
            });
        }
    }

    const handleDeleteMessage = async(id: number) => {
        try {
            const { error } = await SupabaseAPI.from("communities_post").delete().eq("id", id);
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
        myCommunity,
        community,
        search,
        setSearch,
        isLoading,
        handleJoinCommunity,
        setCommunitiesId,
        singleCommunity,
        follower,
        post,
        user,
        handlePostMessage,
        message,
        image,
        setMessage,
        handlePickImage,
        handleUnPickImage,
        sheetOverlay,
        handleShowDelete,
        fetchCommunityMember,
        fetchCommunity
    }
}
