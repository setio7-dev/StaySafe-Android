import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

interface primaryGradientProp {
    children: React.ReactNode;
    className: string;
    roundedTop?: number;
    roundedBottom?: number;
}

export default function PrimaryGradient({ children, className, roundedTop, roundedBottom }: primaryGradientProp) {
  return (
    <LinearGradient colors={["#1D4ED8", "#137DD3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className={className} style={{ borderTopLeftRadius: roundedTop, borderTopRightRadius: roundedTop, borderBottomLeftRadius: roundedBottom, borderBottomRightRadius: roundedBottom }}>
        {children}
    </LinearGradient>
  )
}
