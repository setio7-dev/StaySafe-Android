import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import MaskotScene from '@/app/components/MaskotScene';
import React from 'react'

export default function ceritaar() {
  return (
    <CustomSafeAreaView>
        <BackPage type={false} title='Cerita AR'/>
        {/* <ViroARSceneNavigator initialScene={{ scene: MaskotScene }} style={{ flex: 1 }}/> */}
    </CustomSafeAreaView>
  )
}
