import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type SidePill = {
  text: string;
  icon?: React.ReactNode;
  textColor: string;
};

type MainContent = {
  text?: string;
  icon?: React.ReactNode;
  textColor: string;
};

export type CTAConfig =
  | {
      type: "full-gradient";
      mainContent: MainContent;
      onPress: () => void;
      disabled?: boolean;
    }
  | {
      type: "split-gradient";
      sidePill: SidePill;
      mainContent: MainContent;
      onPress: () => void;
      onMainPress?: () => void;
      disabled?: boolean;
    };

interface CTAButtonProps {
  config: CTAConfig;
}

const SidePillView: React.FC<{ pill: SidePill }> = ({ pill }) => (
  <View
    style={{
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 12,
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: pill.textColor,
        fontSize: FONT_SIZES.small,
        fontWeight: "400",
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {pill.text}
    </Text>
    {pill.icon}
  </View>
);

const CTAButton: React.FC<CTAButtonProps> = ({ config }) => {
  if (config.type === "full-gradient") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={(e) => {
          e.stopPropagation();
          config.onPress();
        }}
        disabled={config.disabled}
      >
        <LinearGradient
          colors={["#50ABE0", "#5EC598"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0.625, 1]}
          style={{ borderRadius: 10, paddingVertical: 14 }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: SPACING.xSmall,
            }}
          >
            {config.mainContent.icon}
            {config.mainContent.text && (
              <Text
                style={{
                  color: config.mainContent.textColor,
                  fontSize: FONT_SIZES.medium,
                  fontWeight: "600",
                }}
              >
                {config.mainContent.text}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: 4,
      }}
    >
      <SidePillView pill={config.sidePill} />

      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={(e) => {
          e.stopPropagation();
          config.onMainPress ? config.onMainPress() : config.onPress();
        }}
        activeOpacity={0.8}
        disabled={config.disabled}
      >
        <LinearGradient
          colors={["#50ABE0", "#5EC598"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0.625, 1]}
          style={{
            borderRadius: 10,
            padding: 2,
            width: "100%",
            flexShrink: 1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: COLORS.background,
              paddingVertical: 14,
              flexDirection: "row",
              gap: SPACING.xSmall,
            }}
          >
            {config.mainContent.icon}
            {config.mainContent.text && (
              <Text
                style={{
                  color: config.mainContent.textColor,
                  fontSize: FONT_SIZES.medium,
                  fontWeight: "600",
                }}
              >
                {config.mainContent.text}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(CTAButton);
