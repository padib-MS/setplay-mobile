import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { TouchableOpacity, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];
interface ToggleButtonProps {
  active: boolean;
  onPress: () => void;
  icon?: React.ElementType;
  iconName?: string;
  label: string;
  width?: number;
}

export const ToggleButton = ({
  active,
  onPress,
  icon,
  iconName,
  label,
  width,
}: ToggleButtonProps) => {
  const IconComponent =
    icon ??
    ((props: { name: IoniconsName; size: number; color: string }) => (
      <Ionicons {...props} />
    ));

  const iconColor = active ? COLORS.text : COLORS.primary;

  const Content = (
    <>
      {iconName && icon ? (
        <>
          <IconComponent name={iconName} size={18} color={iconColor} />
          <Text style={{ fontSize: FONT_SIZES.small, color: COLORS.text }}>
            {label}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: FONT_SIZES.small, color: COLORS.text }}>
          {label}
        </Text>
      )}
    </>
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {active ? (
        <LinearGradient
          colors={["#50ABE0", "#5EC598"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0.625, 1]}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            justifyContent: "center",
            width: width ?? undefined,
          }}
        >
          {Content}
        </LinearGradient>
      ) : (
        <View
          style={[
            {
              width: width ?? undefined,
              backgroundColor: "transparent",
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            },
          ]}
        >
          {Content}
        </View>
      )}
    </TouchableOpacity>
  );
};
