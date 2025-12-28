import { Audio } from 'expo-av'
import { useEffect, useRef, useState } from 'react'

export default function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)

  const play = async (url: string) => {
    try {
      if (currentUrl === url && soundRef.current) {
        await soundRef.current.playAsync()
        setIsPlaying(true)
        return
      }

      await stop()
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      )

      soundRef.current = sound
      setCurrentUrl(url)
      setIsPlaying(true)

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0)
        setPosition(status.positionMillis ? status.positionMillis / 1000 : 0)
        if (status.didJustFinish) stop()
      })

    } catch (err) {
      console.log('Audio play error:', err)
    }
  }

  const pause = async () => {
    if (!soundRef.current) return
    await soundRef.current.pauseAsync()
    setIsPlaying(false)
  }

  const stop = async () => {
    if (!soundRef.current) return
    await soundRef.current.stopAsync()
    await soundRef.current.unloadAsync()
    soundRef.current = null
    setIsPlaying(false)
    setCurrentUrl(null)
    setDuration(0)
    setPosition(0)
  }

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  return {
    play,
    pause,
    stop,
    isPlaying,
    currentUrl,
    duration,
    position
  }
}

export const getAudioDurationMinutes = async (uri: string): Promise<number> => {
  try {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false }
    )

    let duration = 0
    if ('durationMillis' in status && status.durationMillis) {
      duration = status.durationMillis / 1000 / 60
    }

    await sound.unloadAsync()
    return duration
  } catch (error) {
    console.log('Error getting audio duration:', error)
    return 0
  }
}