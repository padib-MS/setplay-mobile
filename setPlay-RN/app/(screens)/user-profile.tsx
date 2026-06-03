import GigPage from "@/components/GigPage";
import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import LoadIndicator from "@/components/ui/LoadIndicator";
import ProfilePicWIthRating from "@/components/ui/ProfilePicWIthRating";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useInitializeChat } from "@/hooks/useInitializeChat";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Params = {
  userId: string;
  role: string;
};

export default function UserProfile() {
  const { userId, role } = useLocalSearchParams<Params>();
  const currentUser = useUserStore((s) => s.user?.id);
  const profileCard = useUserStore((s) => s.profileData);
  const getProfileCard = useUserStore((s) => s.fetchProfileCard);
  const isLoading = useUserStore((s) => s.loading);
  const setSelectedGig = useGigStore((s) => s.setSelectedGig);
  const stopPlayback = useAudioStore((s) => s.stopPlayback);
  const { openChat } = useInitializeChat();

  useEffect(() => {
    getProfileCard(userId);
  }, [userId]);

  const handleGigPress = useCallback(
    (gigId: string) => {
      setSelectedGig(gigId);
      stopPlayback();
      router.navigate("/(screens)/gig-card");
    },
    [setSelectedGig, stopPlayback],
  );

  return (
    <BackgroundPicture bgImage={require("@/assets/images/offers-bg.webp")}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
        intensity={10}
        style={{ flex: 1 }}
      >
        <View style={styles.profileWrapper}>
          <ArrowBack
            icon="close"
            style={{ marginRight: 16 }}
            onPress={() => router.back()}
          />
          {isLoading ? (
            <LoadIndicator isLoading />
          ) : (
            <>
              <View style={styles.container}>
                <View style={styles.topRow}>
                  <ProfilePicWIthRating
                    width={88}
                    height={88}
                    avatar={profileCard?.avatar}
                    newRating={
                      role === "Producer"
                        ? profileCard?.producerRating
                        : profileCard?.djRating
                    }
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>
                      {profileCard?.name?.toUpperCase()}
                    </Text>
                  </View>
                  {profileCard?.id !== currentUser ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.iconSpacing}
                      onPress={() =>
                        openChat({
                          id: profileCard?.id!,
                          name: profileCard?.name!,
                          avatar: profileCard?.avatar!,
                        })
                      }
                    >
                      <Image
                        source={require("@/assets/icons/Chat.svg")}
                        style={{ width: 24, height: 24 }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.gigsRow}>
                  <View style={styles.gigsInfoContainer}>
                    <Image
                      source={require("@/assets/icons/DJ.svg")}
                      style={{ width: 16, height: 16 }}
                    />
                    <Text style={styles.gigsInfo}>
                      Gigs Played:{" "}
                      <Text style={{ color: COLORS.text }}>
                        {profileCard?.djCompletedGigs?.gigCards.length}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.gigsInfoContainer}>
                    <Image
                      source={require("@/assets/icons/Producer.svg")}
                      style={{ width: 16, height: 16 }}
                    />
                    <Text style={styles.gigsInfo}>
                      Songs Offered:{" "}
                      <Text style={{ color: COLORS.text }}>
                        {profileCard?.producerCompletedGigs?.gigCards.length}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.gigListContainer}>
                <Text style={styles.gigList}>Gigs</Text>
                <GigPage
                  data={
                    role === "Producer"
                      ? profileCard?.producerCompletedGigs?.gigCards
                      : profileCard?.djCompletedGigs?.gigCards
                  }
                  emptyMessage="There's no done gigs yet"
                  isLoading={isLoading}
                  onGigPress={handleGigPress}
                />
              </View>
            </>
          )}
        </View>
      </BlurView>
    </BackgroundPicture>
  );
}

const styles = StyleSheet.create({
  profileWrapper: {
    marginTop: 80,
    marginHorizontal: SPACING.medium,
    flex: 1,
  },
  container: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: SPACING.small,
    gap: SPACING.small,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  nameContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginLeft: 8,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
  },
  name: {
    fontSize: FONT_SIZES.large,
    color: COLORS.secondary,
  },
  iconSpacing: {
    borderWidth: 1,
    padding: 11,
    marginLeft: SPACING.small,
    borderColor: COLORS.primary,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  gigsRow: {
    flexDirection: "row",
    width: "100%",
    gap: SPACING.small,
  },
  gigsInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.xSmall,
    paddingHorizontal: 6,
    borderRadius: 6,
    flexShrink: 1,
  },
  gigsInfo: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
  },
  gigListContainer: {
    flex: 1,
    flexDirection: "column",
  },
  gigList: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    marginBottom: SPACING.small,
    marginTop: SPACING.small,
  },
});
