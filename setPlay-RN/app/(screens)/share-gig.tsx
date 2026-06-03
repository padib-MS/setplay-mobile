import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import { Text } from "@/components/ui/Text";
import {
  DEFAULT_THUMBHASH,
  FALLBACK_IMAGE,
  VENUE_IMAGES,
} from "@/constants/constants";
import { COLORS } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { formatDate } from "@/utils/formatDate";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { captureRef } from "react-native-view-shot";

export default function SocialsShareModal() {
  const gig = useGigStore((state) => state.selectedGigForShare);
  const viewRef = useRef(null);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share Event",
        });
        router.back();
      } else {
        throw new Error("Sharing not available on this device");
      }
    } catch (error) {
      throw new Error("Error sharing content: " + error);
    }
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={() => router.back()}
      statusBarTranslucent
    >
      <BackgroundPicture
        bgImage={require("@/assets/images/share-bg.webp")}
        styles={styles.background}
      >
        <View style={styles.header}>
          <ArrowBack
            ovalOrSquare="square"
            style={{ borderRadius: 10, marginLeft: 0 }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShare}
            style={{
              borderRadius: 10,
              borderWidth: 2,
              borderColor: COLORS.primary,
            }}
          >
            <LinearGradient
              colors={["#50ABE0", "#5EC598"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              locations={[0.625, 1]}
              style={{
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Ionicons name="share-social" size={24} color={COLORS.text} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View ref={viewRef} collapsable={false} style={styles.preview}>
          <View style={styles.imageContainer}>
            <Image
              source={
                gig?.backgroundImage
                  ? (VENUE_IMAGES[gig.backgroundImage] ?? FALLBACK_IMAGE)
                  : FALLBACK_IMAGE
              }
              style={styles.previewImage}
              placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
              transition={100}
              contentFit="cover"
              cachePolicy="memory"
            />
          </View>
          <View style={{ padding: 8 }}>
            <Text
              style={{
                ...styles.previewsongName,
                color: COLORS.primary,
                borderBottomColor: COLORS.primary,
                borderBottomWidth: 1,
                paddingBottom: 8,
              }}
            >
              {gig?.dj.name}{" "}
              <Text style={{ color: COLORS.text }}>plays...</Text>
            </Text>
            {gig?.offerOnGig?.producer.name ? (
              <Text style={{ ...styles.previewsongName, color: COLORS.alert }}>
                {gig?.offerOnGig?.producer.name}{" "}
                <Text style={{ color: COLORS.text }}>{gig?.song?.name}</Text>
              </Text>
            ) : (
              <Text style={{ ...styles.previewsongName, color: COLORS.text }}>
                {gig?.song?.name}
              </Text>
            )}
            <Text style={{ ...styles.previewsongName, color: "#5EC598" }}>
              {gig?.song?.genre}{" "}
              <Text style={{ color: COLORS.text }}>{gig?.song?.bpm} BPM</Text>
            </Text>
            <Text
              style={{
                ...styles.previewsongName,
                color: COLORS.secondary,
                borderBottomColor: COLORS.primary,
                borderBottomWidth: 1,
                paddingBottom: 8,
              }}
            >
              {formatDate(gig?.date)}{" "}
              <Text style={{ color: COLORS.text }}>{gig?.location}</Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
                gap: 16,
              }}
            >
              <Image
                source={require("@/assets/icons/logo.svg")}
                style={styles.previewLogo}
                placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                contentFit="contain"
                cachePolicy="memory"
              />
              <Text style={{ fontSize: 14, color: COLORS.text }}>SETPLAY</Text>
            </View>
          </View>
        </View>
      </BackgroundPicture>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  preview: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    width: "80%",
    borderWidth: 1,
    borderColor: COLORS.primary,
    boxShadow: `0 0 30px 5px ${COLORS.primary}70`,
  },

  imageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  previewImage: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  previewsongName: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  previewLogo: {
    width: 28,
    height: 30,
  },
});
