import GigPage from "@/components/GigPage";
import DotCarousel from "@/components/navigation/DotCarousel";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import Header from "@/components/ui/Header";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useGigRoutes } from "@/hooks/useGigRoutes";
import { useInitializeUser } from "@/hooks/useInitializeUser";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGigStore } from "@/stores/useGigStore";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

const USER_ID = "3ed3c11d-f4ad-4749-b30b-6466e9e40277";
// const USER_ID = "44444444-4444-4444-4444-444444444444";
// const USER_ID = useUserStore((state) => state.user?.id);

export default function HomeScreen() {
  const setSelectedGig = useGigStore((state) => state.setSelectedGig);
  const isLoading = useGigStore((state) => state.loading);
  const isLoadingMore = useGigStore((state) => state.loadingMore);
  const loadMoreGigs = useGigStore((state) => state.loadMoreGigs);
  const stopPlayback = useAudioStore((state) => state.stopPlayback);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const pagerRef = useRef<PagerView>(null);

  useInitializeUser(USER_ID);

  const {
    routes,
    getRouteData,
    getEmptyMessage,
    currentMode,
    handleTabChange,
  } = useGigRoutes();

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentMode]);

  const handleGigPress = useCallback(
    (gigId: string) => {
      setSelectedGig(gigId);
      stopPlayback();
      router.navigate("/(screens)/gig-card");
    },
    [setSelectedGig, stopPlayback],
  );

  useEffect(() => {
    if (routes.length > 0) {
      handleTabChange(routes[0].key);
    }
  }, [routes]);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const index = e.nativeEvent.position;
      setCurrentIndex(index);
      handleTabChange(routes[index].key);
    },
    [routes, handleTabChange],
  );

  return (
    <BackgroundPicture
      bgImage={
        currentMode === "business"
          ? require("@/assets/images/business.webp")
          : require("@/assets/images/non-business.webp")
      }
      styles={{
        ...styles.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
      }}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {routes[currentIndex]?.title ?? ""}
          </Text>
        </View>

        <PagerView
          key={currentMode}
          ref={pagerRef}
          style={styles.container}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {routes.map((route) => (
            <GigPage
              key={route.key}
              data={getRouteData(route.key)}
              emptyMessage={getEmptyMessage(route.key)}
              onGigPress={handleGigPress}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              loadNextPage={() => loadMoreGigs(route.key)}
            />
          ))}
        </PagerView>

        <DotCarousel
          routes={routes}
          index={currentIndex}
          style={styles.dotCarousel}
        />
      </SafeAreaView>
    </BackgroundPicture>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    paddingHorizontal: SPACING.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.small,
  },
  sectionTitle: {
    marginTop: SPACING.medium,
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    alignSelf: "flex-end",
  },
  dotCarousel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
  },
});
