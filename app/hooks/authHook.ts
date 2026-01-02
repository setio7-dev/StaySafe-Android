import { useEffect, useState } from 'react';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import { useRouter } from 'expo-router';
import { PickImage } from '../utils/pickImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAuthHook() {
    const [user, setUser] = useState<authProps | null>(null);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
    const [showForm, setShowFrom] = useState<boolean>(false);
    const [image, setImage] = useState<any>(null);
    const navigate = useRouter();

    const fetchUser = async () => {
        try {
            const data = await AsyncStorage.getItem('user');
            const dataParse = JSON.parse(data as any);

            setUser(dataParse);
        } catch (error: any) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [navigate]);

    const handleRegister = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            if (!name || !password || !email) {
                ToastMessage({
                    type: "error", text: "Data Wajib Diisi!"
                });
                return;
            }

            const { data: authData, error: authError } = await SupabaseAPI.auth.signUp({ email, password });
            if (authError) {
                ToastMessage({
                    type: "error",
                    text: translateError(authError.message)
                });
                return;
            }

            const { error } = await SupabaseAPI.from("users").insert([
                {
                    auth_id: authData.user?.id,
                    name, email,
                    role: "user"
                }
            ]);

            if (error) {
                ToastMessage({
                    type: "error",
                    text: translateError(error.message),
                });
                return;
            }

            ToastMessage({
                type: "success",
                text: "Daftar Berhasil!"
            });

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate.replace("/pages/auth/login");
            }, 3000);
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            if (!password || !email) {
                ToastMessage({
                    type: "error", text: "Data Wajib Diisi!"
                });
                return;
            }

            const { error, data } = await SupabaseAPI.auth.signInWithPassword({
                email,
                password
            });

            const { data: user } = await SupabaseAPI.from("users").select().eq("auth_id", data.user?.id).single();
            await AsyncStorage.setItem('user', JSON.stringify(user));

            if (error) {
                ToastMessage({
                    type: "error",
                    text: translateError(error.message),
                });
                return;
            }

            ToastMessage({
                type: "success",
                text: "Masuk Berhasil!"
            });

            setTimeout(() => {
                navigate.replace("/pages/onboarding/onboarding");
            }, 3000);
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message),
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            const { error } = await SupabaseAPI.auth.signOut();
            if (error) {
                ToastMessage({
                    type: "error",
                    text: translateError(error.message),
                });
                return;
            }

            await AsyncStorage.removeItem('user');
            ToastMessage({
                type: "success",
                text: "Keluar Berhasil!"
            });


            setTimeout(() => {
                navigate.replace("/pages/auth/login");
            }, 3000);
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message),
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handlePickImage = async () => {
        const uri = await PickImage();
        setImage(uri);
    }

    const handleClose = () => {
        setShowFrom(false);
        setName("");
        setEmail("");
        setPassword("");
        setImage(null);
    }

    const handleUpdateUser = async (id: number) => {
        try {
            setIsLoadingProfile(true);
            let uploadImage = "";

            if (image) {
                const formData = new FormData();
                formData.append("upload_preset", "staysafe");
                formData.append("folder", "profile/post");
                formData.append("file", {
                    uri: image,
                    name: `profile_post${Date.now()}.jpg`,
                    type: "image/jpeg",
                } as any);

                const uploadImageCloudinary = await fetch(`https://api.cloudinary.com/v1_1/df9dwfg8r/image/upload`, {
                    method: "POST",
                    body: formData
                });

                const res = await uploadImageCloudinary.json();
                uploadImage = res.secure_url;
            }

            await SupabaseAPI.auth.updateUser({
                email: email || undefined,
                password: password || undefined
            });

            const { data: updatedUser } = await SupabaseAPI
                .from("users")
                .update([
                    {
                        name: name || undefined,
                        email: email || undefined,
                        image: image ? uploadImage : undefined
                    }
                ])
                .eq("id", id)
                .select()
                .single();

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

            ToastMessage({
                type: "success",
                text: "Ubah Profile Berhasil!"
            })
        } catch (error: any) {
            ToastMessage({
                type: "error",
                text: translateError(error.message)
            })
        } finally {
            setIsLoadingProfile(false);
        }
    }

    return {
        handleRegister,
        handleLogin,
        name,
        email,
        password,
        setName,
        setPassword,
        setEmail,
        isLoading,
        isLoadingProfile,
        user,
        handleLogout,
        showForm,
        setShowFrom,
        handlePickImage,
        handleClose,
        image,
        handleUpdateUser,
        fetchUser
    };
}
