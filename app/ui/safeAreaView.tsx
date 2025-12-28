import React from 'react'
import FontLoadedProps from '../utils/fontLoaded'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

interface customSafeAreaViewProps {
    children: React.ReactNode;
    className?: string;
    avoiding?: number;
    platform?: 'padding' | 'position' | 'height'
}

export default function CustomSafeAreaView({
  children,
  className,
  platform = 'padding',
  avoiding = 0,
}: customSafeAreaViewProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} className='bg-white' edges={['top']}>
      <StatusBar backgroundColor="#1D4ED8" style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : platform}
        keyboardVerticalOffset={avoiding}
      >
        <FontLoadedProps>
          <View style={{ flex: 1 }} className={className}>
            {children}
          </View>
        </FontLoadedProps>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


