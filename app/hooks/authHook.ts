import { useEffect, useState } from 'react';
import { SupabaseAPI } from '../server/supabase';
import ToastMessage from '../utils/toastMessage';
import { translateError } from '../utils/translateError';
import { useRouter } from 'expo-router';

export default function useAuthHook() {
    const [user, setUser] = useState<authProps | null>(null);
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useRouter();

    useEffect(() => {    
        const fetchUser = async() => {
            try {
                const { data } = await SupabaseAPI.auth.getUser();
                const { data: authData } = await SupabaseAPI.from("users").select().eq("auth_id", data?.user?.id).single();
                setUser(authData);
            } catch (error: any) {
                console.error(error);
            }
        }

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

    const handleLogin = async() => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            if (!password || !email) {
                ToastMessage({
                    type: "error", text: "Data Wajib Diisi!" 
                });                            
                return;
            }

            const { error } = await SupabaseAPI.auth.signInWithPassword({
                email,
                password
            });

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

    const handleLogout = async() => {
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
        user,
        handleLogout,
    };
}
