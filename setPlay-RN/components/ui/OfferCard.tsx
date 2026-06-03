import { ApiOffer } from "@/api/offer/offer.types";
import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useUserStore } from "@/stores/useUserStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SongCard from "../SongCard";
import MiniAudioPlayer from "./MiniAudioPlayer";
import { modalStyles } from "./ModalStyles";
import Separator from "./Separator";

interface OfferCardProps {
  offer: ApiOffer;
  isSelected?: boolean;
  isArchived?: boolean;
  borderColor: string;
  onChatPress?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isSelected,
  isArchived,
  borderColor,
  onChatPress,
}) => {
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const userId = useUserStore((state) => state.user?.id);

  return (
    <View
      style={{
        filter: isArchived ? "saturate(0)" : "none",
        position: "relative",
      }}
    >
      <ImageBackground
        source={{ uri: offer.producer?.avatar }}
        resizeMode="cover"
        style={[
          styles.offerCardBg,
          {
            borderColor,
            borderWidth: isSelected ? 2 : 1,
            marginTop: isSelected ? 0 : 12,
          },
        ]}
        imageStyle={[styles.offerCardImage, isArchived && { opacity: 0.3 }]}
      >
        <View style={styles.offerHeader}>
          <View
            style={[
              styles.gigItems,
              { borderColor, marginHorizontal: 8, marginBottom: 28 },
            ]}
          >
            <Feather name="headphones" size={14} color={COLORS.primary} />
            <Text style={styles.producerName}>
              {offer.producer?.name ?? ""}
            </Text>

            <Separator color={borderColor} marginHorizontal={0} />

            <View style={styles.ratingWrapper}>
              <Text style={styles.producerRating}>
                {offer.producer?.rating === 0
                  ? "New"
                  : offer.producer?.rating.toFixed(1)}
              </Text>
              {offer.producer?.rating !== 0 && (
                <Image
                  source={require("@/assets/icons/Star.svg")}
                  style={{
                    width: 12,
                    height: 12,
                    marginLeft: 2,
                  }}
                  transition={100}
                  contentFit="cover"
                  cachePolicy="memory"
                  placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                />
              )}
            </View>
          </View>

          {onChatPress && offer.producer.id !== userId && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                padding: 8,
                marginLeft: "auto",
              }}
              onPress={onChatPress}
            >
              <Ionicons
                name="chatbox-outline"
                size={24}
                color={borderColor}
                style={{
                  ...modalStyles.iconSpacing,
                  backgroundColor: "#131C21",
                  borderRadius: 6,
                  borderColor: borderColor,
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <SongCard
          song={offer.song}
          isSelected={!offer.song.isArchived}
          borderColor={borderColor}
          marginHorizontal={0.1}
          singleDigitMode={true}
          titleOrGenre="title"
          color={isSelected ? "#FFD700" : COLORS.primary}
          style={{
            borderWidth: 1,
            marginVertical: 8,
            marginHorizontal: 8,
          }}
          bpm={offer.song.bpm}
          songLength={offer.song.songLength}
        />
      </ImageBackground>

      {isPlaying && <MiniAudioPlayer />}
    </View>
  );
};

export default OfferCard;

export const styles = StyleSheet.create({
  offerCardBg: {
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "column",
    backgroundColor: COLORS.background,
  },
  offerCardImage: {
    borderRadius: 12,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  producerName: {
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
    marginHorizontal: 4,
    color: COLORS.secondary,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  producerRating: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.primary,
  },
  gigItems: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    margin: 8,
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
  },
});
