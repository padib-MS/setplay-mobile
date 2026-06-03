import { useState } from "react";
import { Animated, Easing } from "react-native";

export function useDropdownAnimation(contentHeight: number) {
  const [height] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(0));

  const open = () => {
    Animated.parallel([
      Animated.timing(height, {
        toValue: contentHeight,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(height, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  return {
    open,
    close,
    animatedContainerStyle: { height },
    animatedContentStyle: { opacity },
  };
}
