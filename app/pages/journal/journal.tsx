import useJournalHook from '@/app/hooks/journalHook'
import BackPage from '@/app/ui/backPage'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import FormInput from '@/app/ui/formInput'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from "react-native-calendars"

export default function Journal() {
    const { availableDay, setAvailableDay, journal, moodUser, setMoodUser, desc, setDesc, handlePostJournal, isLoading } = useJournalHook();
    return (
        <CustomSafeAreaView>
            <BackPage type={false} title='Jurnal Harian' />
            <Modal visible={availableDay} transparent animationType="fade">
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="bg-white p-6 rounded-xl w-[320px] relative">
                        <TouchableOpacity onPress={() => setAvailableDay(false)} className='absolute bg-red w-8 h-8 rounded-full flex justify-center items-center -top-2 -right-2'>
                            <Text className='font-poppins_semibold text-white text-[14px]'>X</Text>
                        </TouchableOpacity>
                        <Text className='font-poppins_semibold text-primary text-[18px] text-center'>Perasaan Anda Hari Ini?</Text>
                        <View className='flex flex-col mt-6 gap-6'>
                            <FormInput value={moodUser} onChange={(e) => setMoodUser(e)} text='Perasaan Anda' placeholder='Isi Perasaan Anda...' />
                            <FormInput multiline={true} value={desc} onChange={(e) => setDesc(e)} text='Deskripsi' placeholder='Deskripsi Anda...' />
                            <ButtonPrimary onClick={() => handlePostJournal()} loading={isLoading} text='Kirim' type='gradient' widthFull padding={10} className='mt-6' />
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView className='pt-8 px-6'>
                <View className='flex flex-col gap-2 justify-center items-center'>
                    <Text className='text-black font-poppins_semibold text-[20px]'>Jurnal Kamu</Text>
                    <Text className='text-gray font-poppins_medium text-[14px] text-center'>Tempat aman untuk menuliskan suasana hati, pikiran, dan cerita kecil dari harimu</Text>
                </View>
                <View className='mt-4'>
                    <Calendar
                        onDayPress={day => {
                            console.log('selected day', day);
                        }}
                    />
                </View>
            </ScrollView>
        </CustomSafeAreaView>
    )
}
