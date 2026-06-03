import { ApiGigs } from "@/api/gig/gig.types";
import { ApiSong } from "@/api/song/song.types";
import { Text } from "@/components/ui/Text";
import {
  DEFAULT_THUMBHASH,
  FALLBACK_IMAGE,
  VENUE_IMAGES,
} from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useCTAConfig } from "@/hooks/useCTAConfig";
import { requestMediaPermissions } from "@/hooks/useMediaPermissions";
import { useAudioStore } from "@/stores/useAudioStore";
import { useDjStore } from "@/stores/useDjStore";
import { useGigStore } from "@/stores/useGigStore";
import { useModeStore } from "@/stores/useModeStore";
import { useUserStore } from "@/stores/useUserStore";
import { formatDate } from "@/utils/formatDate";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SongCard from "./SongCard";
import BlurOverlayRow from "./ui/BlurOverlayRow";
import CTAButton from "./ui/CTAButton";
import GigActions from "./ui/GigActions";
import { InfoRow } from "./ui/InfoRow";
import MiniAudioPlayer from "./ui/MiniAudioPlayer";
import ProfilePicWithRating from "./ui/ProfilePicWIthRating";
import Separator from "./ui/Separator";

interface GigCardProps {
  gig: ApiGigs;
  onPress?: (gigId: string) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onPress }) => {
  const currentMode = useModeStore((state) => state.currentMode);
  const userRole = useUserStore((state) => state.user?.role);
  const userName = useUserStore((state) => state.user?.name);
  const userAvatar = useUserStore((state) => state.user?.avatar);
  const userId = useUserStore((state) => state.user?.id);
  const pathname = usePathname();
  const isUserProfile = pathname.includes("user-profile");
  const djRating = useDjStore((state) => state.dj?.rating);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const setVideoToGig = useGigStore((s) => s.setVideoToGig);
  const setSelectedGigId = useGigStore((s) => s.setSelectedGig);
  const djId = useDjStore((state) => state.djId);
  const isDJGig =
    userRole === "DJ" && ("dj" in gig ? gig.dj.id === djId : true);
  const song: ApiSong | undefined = gig.song ?? gig.offerOnGig?.song;
  const hasProducer = Boolean(gig.offerOnGig?.producer);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress(gig.id);
    }
  };

  const hasRated =
    (gig.producer?.id === userId &&
      userRole === "Producer" &&
      gig.hasProducerRated) ||
    (gig.dj.id === userId && userRole === "DJ" && gig.hasDjRated);

  const djInfo = useMemo(() => {
    if (typeof gig === "object" && gig !== null && "dj" in gig) {
      const globalGig = gig as ApiGigs;
      return {
        id: globalGig.dj.id,
        avatar: globalGig.dj.avatar,
        name: globalGig.dj.name,
        rating: globalGig.dj.rating,
        role: "DJ",
      };
    }

    return {
      avatar: userAvatar,
      name: userName,
      rating: djRating,
    };
  }, [gig, userAvatar, userName, djRating]);

  const handleVideoPress = async () => {
    setSelectedGigId(gig.id);

    if (gig.videoUrl) {
      router.navigate({
        pathname: "/(screens)/live-video",
        params: { videoUrl: gig.videoUrl },
      });
      return;
    }

    if (gig.hasVideo) {
      setIsLoadingVideo(true);
      const videoUrl = await setVideoToGig();
      setIsLoadingVideo(false);

      router.navigate({
        pathname: "/(screens)/live-video",
        params: { videoUrl },
      });
    }
  };

  const handleFootagePress = async () => {
    const granted = await requestMediaPermissions();
    if (!granted) {
      alert("Camera and microphone permissions are required.");
      return;
    }
    setSelectedGigId(gig.id);
    router.navigate("/(screens)/live-video");
  };

  const ctaConfig = useCTAConfig({
    gig,
    isDJGig,
    hasProducer,
    handlePress,
    handleFootagePress,
    handleVideoPress,
  });

  const accentColor = hasProducer ? COLORS.text : COLORS.primary;

  return (
    <View
      style={{
        ...styles.card,
        borderColor: accentColor,
      }}
    >
      <ImageBackground
        source={
          gig.backgroundImage
            ? (VENUE_IMAGES[gig.backgroundImage] ?? FALLBACK_IMAGE)
            : FALLBACK_IMAGE
        }
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <View>
          <GigActions isDJGig={isDJGig} gig={gig} hasProducer={hasProducer} />

          <View style={styles.artistsRow}>
            <GlassView
              glassEffectStyle="clear"
              style={{
                ...styles.gigItems,
                padding: 0,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderWidth: 0.1,
                borderColor: COLORS.text,
                flexDirection: "column",
                flex: 0,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                activeOpacity={0.8}
                onPress={() => {
                  if (pathname.includes("search")) router.back();
                  router.navigate({
                    pathname: "/(screens)/user-profile",
                    params: { userId: gig.dj.id, role: "DJ" },
                  });
                }}
              >
                <ProfilePicWithRating
                  width={40}
                  height={40}
                  avatar={djInfo?.avatar}
                  smallOrLarge="small"
                  border={false}
                  displayRating={false}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />

                <Separator color={accentColor} marginHorizontal={0} />
                {djInfo?.rating !== undefined && djInfo?.rating !== null && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 6,
                    }}
                  >
                    <Text style={styles.rating}>
                      {djInfo.rating === 0 ? "New" : djInfo.rating.toFixed(1)}
                    </Text>
                    {djInfo.rating === 0 ? null : (
                      <Image
                        source={require("@/assets/icons/Star.svg")}
                        style={{ width: 16, height: 16 }}
                        transition={100}
                        contentFit="cover"
                        cachePolicy="memory"
                        placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {userRole === "DJ" && (
                  <Image
                    source={require("@/assets/icons/DJ.svg")}
                    style={{ marginLeft: 5, width: 14, height: 14 }}
                    transition={100}
                    contentFit="cover"
                    cachePolicy="memory"
                    placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                  />
                )}

                <Text style={styles.artistName}>
                  {djInfo?.role} {djInfo?.name}
                </Text>
              </View>
            </GlassView>

            {!hasProducer ? (
              <GlassView
                style={{
                  ...styles.gigItems,
                  paddingVertical: 10,
                  paddingHorizontal: 6,
                  borderRadius: 10,
                  gap: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderWidth: 0.1,
                  borderColor: COLORS.text,
                  flex: 0,
                }}
              >
                <Image
                  source={require("@/assets/icons/Producer.svg")}
                  style={{ width: 14, height: 14 }}
                  transition={100}
                  contentFit="cover"
                  cachePolicy="memory"
                  placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                />
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: FONT_SIZES.small,
                  }}
                >
                  Selecting...
                </Text>
              </GlassView>
            ) : (
              <GlassView
                style={{
                  ...styles.gigItems,
                  padding: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderWidth: 0.1,
                  borderColor: COLORS.text,
                  flexDirection: "column",
                  flex: 0,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (pathname.includes("search")) router.back();
                    router.navigate({
                      pathname: "/(screens)/user-profile",
                      params: { userId: gig.producer?.id, role: "Producer" },
                    });
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <ProfilePicWithRating
                      avatar={gig.offerOnGig?.producer.avatar}
                      width={40}
                      height={40}
                      smallOrLarge="small"
                      border={false}
                      displayRating={false}
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    />

                    <Separator color={accentColor} marginHorizontal={0} />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: 6,
                      }}
                    >
                      <Text style={styles.rating}>
                        {gig.offerOnGig?.producer.rating === 0
                          ? "New"
                          : gig.offerOnGig?.producer.rating.toFixed(1)}
                      </Text>
                      {gig.offerOnGig?.producer.rating === 0 ? null : (
                        <Image
                          source={require("@/assets/icons/Star.svg")}
                          style={{ width: 16, height: 16 }}
                          transition={100}
                          contentFit="cover"
                          cachePolicy="memory"
                          placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                        />
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={require("@/assets/icons/Producer.svg")}
                      style={{ width: 14, height: 14, marginLeft: 5 }}
                      transition={100}
                      contentFit="cover"
                      cachePolicy="memory"
                      placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                    />

                    <Text style={styles.artistName}>
                      {"Producer " + (gig.offerOnGig?.producer.name ?? "")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </GlassView>
            )}
          </View>
        </View>

        {gig.hasVideo ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: currentMode === "business" && !hasRated ? 100 : 0,
              justifyContent: "center",
              alignItems: "center",
            }}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleVideoPress}
              style={{
                borderWidth: 1,
                padding: 12,
                borderRadius: 6,
                backgroundColor: COLORS.background,
                borderColor: accentColor,
              }}
            >
              {isLoadingVideo ? (
                <ActivityIndicator size={20} color={COLORS.primary} />
              ) : (
                <Feather name="video" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        <View>
          {gig.song?.uri || gig.offerOnGig?.song?.uri ? (
            <View
              style={{
                marginBottom: SPACING.small,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  borderColor: COLORS.text,
                  borderWidth: 0.2,
                  marginBottom: SPACING.small,
                  borderRadius: 10,
                  paddingVertical: SPACING.xSmall,
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                  }}
                >
                  <BlurOverlayRow>
                    <InfoRow
                      icon={<Ionicons name="location-outline" />}
                      text={gig.location}
                      iconColor={COLORS.primary}
                      textColor={COLORS.text}
                    />
                    <InfoRow
                      text={gig.venue}
                      iconColor={COLORS.primary}
                      textColor={COLORS.text}
                    />
                  </BlurOverlayRow>

                  <BlurOverlayRow>
                    <InfoRow
                      icon={
                        <Image
                          source={require("@/assets/icons/Calendar.svg")}
                          style={{ width: 16, height: 16 }}
                          transition={100}
                          contentFit="cover"
                          cachePolicy="memory"
                          placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                        />
                      }
                      text={formatDate(gig.date)}
                      iconColor={COLORS.primary}
                      textColor={COLORS.text}
                    />
                    <InfoRow
                      text={gig.time?.toLowerCase().replace(/\s+/g, "") ?? ""}
                      iconColor={COLORS.primary}
                      textColor={COLORS.text}
                    />
                  </BlurOverlayRow>
                </View>
              </View>
              <SongCard
                song={song!}
                gig={gig}
                borderColor={COLORS.background}
                marginHorizontal={0.1}
                color={gig.offerOnGig?.id ? COLORS.text : COLORS.primary}
                singleDigitMode={gig.offerOnGig?.id ? true : false}
                titleOrGenre={gig.offerOnGig?.id ? "title" : "genre"}
                bpm={
                  gig.offerOnGig?.id ? gig.offerOnGig.song.bpm : gig.bpmRange
                }
              />
              {isPlaying ? <MiniAudioPlayer /> : null}
            </View>
          ) : null}

          {currentMode === "business" &&
            ctaConfig &&
            !isUserProfile &&
            !hasRated && <CTAButton config={ctaConfig} />}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: SPACING.small,
    borderWidth: 1,
    height: 340,
  },
  backgroundImage: {
    flex: 1,
    padding: SPACING.small,
    paddingTop: SPACING.xSmall,
    justifyContent: "space-between",
  },
  backgroundImageStyle: {
    borderRadius: 10,
  },
  artistsRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  artistName: {
    color: COLORS.text,
    marginHorizontal: 6,
    fontSize: FONT_SIZES.small,
  },
  rating: {
    color: COLORS.primary,
    marginRight: 4,
  },
  gigItems: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    color: COLORS.primary,
    marginBottom: SPACING.xSmall,
  },
});

export default React.memo(GigCard);
