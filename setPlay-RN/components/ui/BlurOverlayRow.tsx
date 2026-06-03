import { BlurView } from "expo-blur";
import React from "react";
import { View } from "react-native";

interface BlurOverlayRowProps {
  children: React.ReactNode;
}

const BlurOverlayRow: React.FC<BlurOverlayRowProps> = ({ children }) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{
          filter: "blur(0.1px)",
        }}
      >
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={5}
          tint="dark"
          style={{
            flexDirection: "row",
            overflow: "hidden",
            borderRadius: 10,
            maxWidth: "100%",
          }}
        >
          {children}
        </BlurView>
      </View>

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          flexDirection: "row",
          alignSelf: "flex-start",
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default React.memo(BlurOverlayRow);
