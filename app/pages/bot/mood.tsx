import BackPage from '@/app/ui/backPage'
import CustomSafeAreaView from '@/app/ui/safeAreaView'
import React from 'react'

export default function Mood() {
  return (
    <CustomSafeAreaView>
        <BackPage type={false} title='Safe Talk AI'/>
        
    </CustomSafeAreaView>
  )
}
