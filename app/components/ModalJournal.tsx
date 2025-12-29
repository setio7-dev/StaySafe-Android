import React from 'react'
import journalMood from "@/assets/images/journal/mood.png"
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import useJournalHook from '../hooks/journalHook';
import FormInput from '../ui/formInput';
import ButtonPrimary from '../ui/buttonPrimary';

export default function ModalJournal({ show, onClose  }: any) {
    const { moodUser, setMoodUser, desc, setDesc, handlePostJournal, isLoading, moodRadio } = useJournalHook();
    return (
        <Modal visible={show} transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center">
                <View className="bg-white p-6 rounded-xl w-[320px] relative">
                    <TouchableOpacity onPress={onClose} className='absolute bg-red w-8 h-8 rounded-full flex justify-center items-center -top-2 -right-2'>
                        <Text className='font-poppins_semibold text-white text-[14px]'>X</Text>
                    </TouchableOpacity>
                    <View className='flex flex-col gap-4'>
                        <Image source={journalMood} className='w-20 h-20 mx-auto' />
                        <Text className='font-poppins_semibold text-primary text-[18px] text-center'>Perasaan Anda Hari Ini?</Text>
                    </View>
                    <View className='flex flex-col mt-6 gap-6'>
                        <View className=''>
                            {moodRadio.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setMoodUser(item.value)}
                                    className="flex-row items-center mb-3"
                                >
                                    <View className="w-[22px] h-[22px] rounded-full border-2 border-secondary items-center justify-center mr-2.5">
                                        {moodUser === item.value && (
                                            <View className="w-3 h-3 rounded-full bg-secondary" />
                                        )}
                                    </View>

                                    <Text className="text-[14px] font-poppins_medium text-black">
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <FormInput multiline={true} value={desc} onChange={(e) => setDesc(e)} text='Deskripsi' placeholder='Deskripsi Perasaan Anda...' />
                        <ButtonPrimary onClick={() => handlePostJournal()} loading={isLoading} text='Kirim' type='gradient' widthFull padding={10} className='mt-6' />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
