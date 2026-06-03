import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS } from "@/constants/theme";
import { useDjStore } from "@/stores/useDjStore";
import { useProducerStore } from "@/stores/useProducerStore";
import { useUserStore } from "@/stores/useUserStore";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { ImageSourcePropType, View } from "react-native";

type ProfilePicWithRatingProps = {
  width?: number;
  height?: number;
  avatar?: string;
  smallOrLarge?: "small" | "large";
  border?: boolean;
  displayRating?: boolean;
  style?: object;
  newRating?: number | undefined;
};

const PROFILE_THUMBHASH = "L4ADc800009F~qj[j[j[j[j[j[j[";

const ProfilePicWithRating: React.FC<ProfilePicWithRatingProps> = ({
  width,
  height,
  avatar,
  newRating,
  smallOrLarge = "large",
  border = true,
  displayRating = true,
  style,
}) => {
  const userAvatar = useUserStore((state) => state.user?.avatar);
  const userRole = useUserStore((state) => state.user?.role);
  const userName = useUserStore((state) => state.user?.name);
  const djRating = useDjStore((state) =>
    newRating !== undefined ? undefined : state.dj?.rating,
  );
  const producerRating = useProducerStore((state) =>
    newRating !== undefined ? undefined : state.producer?.rating,
  );

  const initials = useMemo(() => {
    if (!userName) return "";
    return userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  const imageSource: ImageSourcePropType | null = useMemo(() => {
    if (avatar) return { uri: avatar };
    if (userAvatar) {
      return typeof userAvatar === "string" ? { uri: userAvatar } : userAvatar;
    }
    return null;
  }, [avatar, userAvatar]);

  const rating = useMemo(() => {
    if (newRating !== undefined) return newRating;
    if (userRole === "DJ") return djRating;
    return producerRating;
  }, [userRole, djRating, producerRating, newRating]);

  const formatted = rating ? rating.toFixed(1) : undefined;

  const containerSize = {
    width: width ?? 80,
    height: height ?? 80,
    borderWidth: border ? 1 : 0,
    borderColor: COLORS.primary,
    borderRadius: 8,
    ...style,
  };
  return (
    <View>
      {imageSource ? (
        <Image
          source={imageSource}
          style={containerSize}
          placeholder={PROFILE_THUMBHASH}
          transition={200}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          style={[
            containerSize,
            {
              backgroundColor: COLORS.background,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: (width ?? 80) * 0.35,
              fontWeight: "bold",
            }}
          >
            {initials}
          </Text>
        </View>
      )}

      {displayRating && rating !== null && rating !== undefined && (
        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.background,
            borderRadius: 6,
            paddingHorizontal: smallOrLarge === "small" ? 3 : 6,
            paddingVertical: 2,
            marginBottom: smallOrLarge === "small" ? 2 : 4,
            marginRight: smallOrLarge === "small" ? 2 : 4,
            position: "absolute",
            bottom: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              marginRight: 4,
              fontSize: smallOrLarge === "small" ? 10 : 12,
            }}
          >
            {rating === 0 ? "New" : formatted}
          </Text>
          {rating !== 0 && (
            <Image
              source={require("@/assets/icons/Star.svg")}
              style={{
                width: smallOrLarge === "small" ? 12 : 14,
                height: smallOrLarge === "small" ? 12 : 14,
              }}
              transition={100}
              contentFit="cover"
              cachePolicy="memory"
              placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(ProfilePicWithRating);
