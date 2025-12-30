import useJournalHook from '@/app/hooks/journalHook'
import BackPage from '@/app/ui/backPage'
import ButtonPrimary from '@/app/ui/buttonPrimary'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import Loader from '@/app/utils/loader'
import React, { useState } from 'react'
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from "react-native-calendars"
import journalMood from "@/assets/images/journal/mood.png"
import PrimaryGradient from '@/app/utils/primaryGradient'
import { PieChart } from "react-native-gifted-charts"
import ModalJournal from '@/app/components/ModalJournal'

export default function Journal() {
    const { setAvailableDay, availableDay, getJournalByDate, journal, isLoading, isLoadingLoader, showJournal, handleMoodAnalysis, moodAnalysis } = useJournalHook();
    const latestAnalysis = moodAnalysis?.[moodAnalysis.length - 1];
    const [selectedJournal, setSelectedJournal] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);    
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

    if (isLoadingLoader) {
        return <Loader fullScreen={true} text='Memuat...' />
    }
    return (
        <CustomSafeAreaView>
            <BackPage type={false} title='Jurnal Harian' />
            <ModalJournal show={availableDay} onClose={() => setAvailableDay(false)} />
            <Modal visible={showDetail} transparent animationType="fade">
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="bg-white p-6 rounded-xl w-[300px]">
                        <Text className="text-[16px] font-poppins_semibold text-secondary mb-2">
                            Perasaan: {selectedJournal?.mood}
                        </Text>

                        <Text className="text-[14px] font-poppins_regular text-black">
                            {selectedJournal?.desc}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowDetail(false)}
                            className="mt-6 bg-secondary py-2 rounded-lg"
                        >
                            <Text className="text-white text-center font-poppins_semibold">
                                Tutup
                            </Text>
                        </TouchableOpacity>
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
                                const isDisabled = state === "disabled";

                                return (
                                    <TouchableOpacity
                                        disabled={!journalToday || isDisabled}
                                        onPress={() => {
                                            setSelectedJournal(journalToday);
                                            setShowDetail(true);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                paddingVertical: 4,
                                                borderRadius: 8,
                                                backgroundColor: journalToday ? "#137DD3" : "transparent",
                                                width: 40,
                                                height: 48,
                                                opacity: isDisabled ? 0.4 : 1,
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
                                                    color: isDisabled
                                                        ? "#A1A1AA"
                                                        : journalToday
                                                            ? "white"
                                                            : "#000",
                                                    fontSize: 14,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {date?.day}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
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
                <ButtonPrimary loading={isLoading} text='Analisis Jurnal' textSize={14} padding={12} type='gradient' width={200} className='mx-auto mt-8' onClick={() => handleMoodAnalysis()} />
                <View className='flex mt-10 flex-col px-6'>
                    {latestAnalysis && (
                        <View className='flex flex-col justify-center items-center mt-4'>
                            <Text className='font-poppins_semibold text-black text-[18px] text-center'>Analisa Perasaan Kamu</Text>
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
                    )}
                </View>
                {latestAnalysis && (
                    <View className='flex mt-12 flex-col px-6'>
                        <Text className='font-poppins_semibold text-black text-[18px] text-center'>Riwayat Analisis</Text>
                        <View className='flex flex-col gap-6 mt-6'>
                            {moodAnalysis?.map((item, index) => (
                                <View key={index} className='bg-secondary/80 border-2 border-secondary p-4 rounded-lg flex flex-col gap-2'>
                                    <Text className='font-poppins_semibold text-[18px] mb-4 text-white text-center'>Analisis Ke-{index + 1}</Text>
                                    <Text className='font-poppins_medium text-white text-[14px]'>Mood : {item.mood_user}</Text>
                                    <Text className='font-poppins_medium text-justify text-white text-[12px]'>Penjelasan : {item.summary}</Text>
                                    <Text className='font-poppins_medium text-justify text-white text-[12px]'>Saran : {item.suggestion}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </CustomSafeAreaView>
    )
}
