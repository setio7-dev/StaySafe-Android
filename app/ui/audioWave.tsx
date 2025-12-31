/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const BAR_COUNT = 5;

export default function AudioWave({ active }: { active: boolean }) {
  const bars = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(6))
  ).current;

  useEffect(() => {
    if (!active) {
      bars.forEach(bar =>
        Animated.timing(bar, {
          toValue: 6,
          duration: 200,
          useNativeDriver: false,
        }).start()
      );
      return;
    }

    const animate = () => {
      const animations = bars.map(bar =>
        Animated.sequence([
          Animated.timing(bar, {
            toValue: Math.random() * 30 + 10,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 6,
            duration: 200,
            useNativeDriver: false,
          }),
        ])
      );

      Animated.parallel(animations).start(() => {
        if (active) animate();
      });
    };

    animate();
  }, [active]);

  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
      {bars.map((height, i) => (
        <Animated.View
          key={i}
          className={"bg-primary"}
          style={{
            width: 6,
            height,
            borderRadius: 3,
          }}
        />
      ))}
    </View>
  );
}
