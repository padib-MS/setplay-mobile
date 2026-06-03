import { COLORS, SPACING } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useChatStore } from "@/stores/useChatStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

type ArrowBackProps = {
  style?: StyleProp<ViewStyle>;
  icon?: "back" | "close";
  ovalOrSquare?: "oval" | "square";
  onPress?: () => void;
};

const ArrowBack: React.FC<ArrowBackProps> = ({
  style,
  icon = "back",
  ovalOrSquare = "oval",
  onPress,
}) => {
  const { stopPlayback } = useAudioStore();
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  return (
    <View
      style={[
        {
          borderWidth: 2,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderColor: COLORS.primary,
          borderBottomWidth: ovalOrSquare === "oval" ? 0 : 2,
          alignSelf: icon === "close" ? "flex-end" : "flex-start",
          marginLeft: icon === "close" ? 0 : 34,
          marginRight: icon === "close" ? 12 : 0,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress();
            stopPlayback();
            setSelectedChat(null);
          } else {
            router.back();
          }
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#50ABE0", "#5EC598"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0.625, 1]}
          style={{
            width: 45,
            alignItems: "center",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            borderRadius: ovalOrSquare === "oval" ? 0 : 8,
          }}
        >
          <Image
            source={
              icon === "close"
                ? require("@/assets/icons/Close.svg")
                : require("@/assets/icons/Back.svg")
            }
            style={{
              margin: SPACING.small,
              width: 24,
              height: 24,
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ArrowBack;
