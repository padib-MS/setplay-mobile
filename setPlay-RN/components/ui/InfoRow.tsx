import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Text } from "./Text";

interface InfoItemProps {
  icon?: React.ReactElement<any>;
  text: string;
  textColor: string;
  iconColor: string;
  iconSize?: number;
}

export const InfoRow = ({
  icon,
  text,
  textColor,
  iconColor,
  iconSize = 14,
}: InfoItemProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 6,
      flexShrink: 1,
    }}
  >
    {icon &&
      (icon.type === Image
        ? icon
        : React.cloneElement(icon, {
            size: iconSize,
            color: iconColor,
          }))}
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{
        flexShrink: 1,
        color: textColor,
        textShadowColor: iconColor,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      }}
    >
      {text}
    </Text>
  </View>
);
