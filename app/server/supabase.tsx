import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://euwgdlyyvujruciutgxo.supabase.co";
const supabasePublishableKey = "sb_publishable_A2qEMOAHWz08IcghH298QQ_BX3-0-HK"

export const SupabaseAPI = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})