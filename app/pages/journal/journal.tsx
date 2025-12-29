import useJournalHook from '@/app/hooks/journalHook'
import BackPage from '@/app/ui/backPage'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import FormInput from '@/app/ui/formInput'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import Loader from '@/app/utils/loader'
import React from 'react'
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from "react-native-calendars"
import journalMood from "@/assets/images/journal/mood.png"
import PrimaryGradient from '@/app/utils/primaryGradient'
import { PieChart } from "react-native-gifted-charts"

export default function Journal() {
    const { availableDay, setAvailableDay, getJournalByDate, journal, moodUser, setMoodUser, desc, setDesc, handlePostJournal, isLoading, user, moodRadio, showJournal, handleMoodAnalysis, moodAnalysis } = useJournalHook();
    const latestAnalysis = moodAnalysis?.[moodAnalysis.length - 1];
    const pieData = latestAnalysis
        ? [
            {
                value: latestAnalysis.statistic,
                color: "#137DD3",
                text: `${latestAnalysis.mood_user}`,
            },
            {
                value: 100 - latestAnalysis.statistic,
                color: "#E5E7EB",
                text: "Lainnya",
            },
        ]
        : [];

    if (!journal || !user) {
        return <Loader fullScreen={true} text='Memuat...' />
    }
    return (
        <CustomSafeAreaView>
            <BackPage type={false} title='Jurnal Harian' />
            <Modal visible={availableDay} transparent animationType="fade">
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="bg-white p-6 rounded-xl w-[320px] relative">
                        <TouchableOpacity onPress={() => setAvailableDay(false)} className='absolute bg-red w-8 h-8 rounded-full flex justify-center items-center -top-2 -right-2'>
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
            <ScrollView className='pt-8 px-6' contentContainerStyle={{ paddingBottom: 120 }}>
                <View className='flex flex-col gap-2 justify-center items-center'>
                    <Text className='text-black font-poppins_semibold text-[20px]'>Jurnal Kamu</Text>
                    <Text className='text-gray font-poppins_medium text-[14px] text-center'>Tempat aman untuk menuliskan suasana hati, pikiran, dan cerita kecil dari harimu</Text>
                </View>
                <View className='mt-4'>
                    {journal?.length ? (
                        <Calendar
                            dayComponent={({ date, state }) => {
                                const journalToday = getJournalByDate(date!.dateString);

                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingVertical: 4,
                                            borderRadius: 8,
                                            backgroundColor: journalToday ? "#137DD3" : "transparent",
                                            width: 40,
                                            height: 48,
                                        }}
                                    >
                                        {journalToday && (
                                            <Text
                                                style={{
                                                    fontSize: 8,
                                                    color: "white",
                                                    fontWeight: "600",
                                                    marginBottom: 2,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {journalToday.mood}
                                            </Text>
                                        )}

                                        <Text
                                            style={{
                                                color:
                                                    state === "disabled"
                                                        ? "#A1A1AA"
                                                        : journalToday
                                                            ? "white"
                                                            : "",
                                                fontSize: 14,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {date?.day}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <Calendar
                            dayComponent={({ date, state }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingVertical: 4,
                                            borderRadius: 8,
                                            width: 40,
                                            height: 48,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "black",
                                                fontSize: 14,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {date?.day}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
                <View className='mt-8'>
                    {showJournal && (
                        <PrimaryGradient className='flex flex-row justify-between items-center p-4 gap-2' roundedBottom={8} roundedTop={8}>
                            <Image source={journalMood} resizeMode='cover' className='w-[110px] h-[110px]' />
                            <View className='flex flex-col flex-1'>
                                <Text className='font-poppins_semibold text-white text-[16px]'>Jurnalmu Belum Diisi!</Text>
                                <Text className='font-poppins_medium text-justify text-white text-[10px]'>Catat aktivitas, perasaan, dan momen pentingmu sekarang</Text>
                                <TouchableOpacity onPress={() => setAvailableDay(true)} className='bg-white rounded-lg w-[100px] flex justify-center items-center py-1.5 mt-4'>
                                    <Text className='font-poppins_semibold text-primary text-[14px]'>Isi Jurnal</Text>
                                </TouchableOpacity>
                            </View>
                        </PrimaryGradient>
                    )}
                </View>
                <View className='flex mt-8 flex-col px-6'>
                    <Text className='font-poppins_semibold text-black text-[18px] text-center'>Analisa Perasaan Kamu</Text>
                    {moodAnalysis ? (
                        <View className='flex flex-col justify-center items-center mt-4'>
                            <PieChart
                                data={pieData}
                                donut
                                radius={160}
                                innerRadius={90}
                                focusOnPress
                                showText
                                textColor="#111827"
                                textSize={14}
                                isAnimated
                                animationDuration={800}
                                centerLabelComponent={() => (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Text className='text-[14px] text-black font-poppins_medium'>
                                            Mood Dominan
                                        </Text>
                                        <Text className='font-poppins_semibold text-primary text-[18px]'>
                                            {latestAnalysis?.mood_user}
                                        </Text>
                                        <Text className='text-[14px] font-poppins_semibold text-gray'>
                                            {latestAnalysis?.statistic}%
                                        </Text>
                                    </View>
                                )}
                            />
                            <View className='flex gap-6 flex-col w-full mt-6'>
                                <View className='bg-primary/80 border-2 border-primary p-4 rounded-lg'>
                                    <Text className='text-white font-poppins_semibold text-[14px]'>Penjelasan: </Text> 
                                    <Text className='text-white font-poppins_medium text-[12px] text-justify'>{latestAnalysis?.summary}</Text> 
                                </View>
                                <View className='bg-primary/80 border-2 border-primary p-4 rounded-lg'>
                                    <Text className='text-white font-poppins_semibold text-[14px]'>Saran: </Text> 
                                    <Text className='text-white font-poppins_medium text-[12px] text-justify'>{latestAnalysis?.suggestion}</Text> 
                                </View>
                            </View>
                        </View>
                    ) : (
                        <Text className='font-poppins_medium text-black text-[14px] text-center mt-6'>Belum Ada Jurnal Yang Dianalisis</Text>
                    )}
                    <ButtonPrimary loading={isLoading} text='Analisis Jurnal' textSize={14} padding={12} type='gradient' width={200} className='mx-auto mt-8' onClick={() => handleMoodAnalysis()} />
                </View>
                <View className='flex mt-8 flex-col px-6'>
                    <Text className='font-poppins_semibold text-black text-[18px] text-center'>Analisa Perasaan Kamu</Text>
                </View>
            </ScrollView>
        </CustomSafeAreaView>
    )
}
