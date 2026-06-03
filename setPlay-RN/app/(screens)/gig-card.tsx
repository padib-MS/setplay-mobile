import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import DjOfferLayout from "@/components/ui/DjOfferLayout";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import { formatDate } from "@/utils/formatDate";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
  Swipeable,
} from "react-native-gesture-handler";

export default function GigCardModal() {
  const selectedGigId = useGigStore((state) => state.selectedGigId);
  const [showArchived, setShowArchived] = useState(false);
  const [sortMode, setSortMode] = useState<"new-old" | "old-new">("new-old");

  const stopPlayback = useAudioStore((s) => s.stopPlayback);
  const userRole = useUserStore((s) => s.user?.role);
  const userId = useUserStore((s) => s.user?.id);
  const isLoading = useUserStore((s) => s.loading);

  const openSwipeableRef = useRef<Swipeable | null>(null);

  const gigWithOffers = useGigStore((state) => {
    for (const tabGigs of Object.values(state.gigsByTab)) {
      const found = tabGigs.find((g) => g.id === selectedGigId);
      if (found) return found;
    }
    return undefined;
  });

  const hasArchivedSongs = useMemo(() => {
    return (
      gigWithOffers?.offers?.djOffers?.some((o) => o.song.isArchived) ?? false
    );
  }, [gigWithOffers]);

  const gigForRender = useMemo(() => {
    if (!gigWithOffers?.offers?.djOffers) return gigWithOffers;

    let sortedOffers = gigWithOffers.offers.djOffers;

    sortedOffers = [...sortedOffers].sort((a, b) => {
      const dateA = new Date(a.song.createdAt || 0).getTime();
      const dateB = new Date(b.song.createdAt || 0).getTime();
      return sortMode === "new-old" ? dateB - dateA : dateA - dateB;
    });

    return {
      ...gigWithOffers,
      offers: {
        ...gigWithOffers.offers,
        djOffers: sortedOffers,
      },
    };
  }, [gigWithOffers, sortMode]);

  const offers = gigForRender?.offers?.djOffers ?? [];

  const yourOffer = offers.find((o) => o.producer.id === userId);

  const otherOffers = showArchived
    ? offers.filter((o) => o.id !== yourOffer?.id)
    : offers.filter((o) => !o.song.isArchived);

  const closeCurrentSwipe = () => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  const handleSortToggle = () => {
    setSortMode((prev) => (prev === "new-old" ? "old-new" : "new-old"));
    closeCurrentSwipe();
  };

  const getSortLabel = () => {
    if (sortMode === "old-new") return "Oldest ↓";
    return "Newest ↑";
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      onRequestClose={() => {
        router.back();
        stopPlayback();
      }}
      statusBarTranslucent
      hardwareAccelerated
    >
      <BackgroundPicture
        bgImage={require("@/assets/images/offers-bg.webp")}
        styles={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <GestureHandlerRootView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 40,
            }}
          >
            <ArrowBack
              onPress={() => router.dismissAll()}
              style={{ marginLeft: 16 }}
            />

            <View
              style={{
                height: "90%",
                borderWidth: 3,
                borderColor: COLORS.primary,
                borderRadius: 16,
                padding: 12,
                backgroundColor: COLORS.background,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: userRole === "Producer" ? 80 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginTop:
                      userRole === "Producer" || offers.length < 3 ? 12 : 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.secondary,
                      }}
                    >
                      Submission |{" "}
                      <Text style={{ color: COLORS.text }}>
                        {gigForRender?.genre}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: "rgba(206, 232, 255, 0.6)",
                        fontSize: 12,
                        marginBottom: 12,
                      }}
                    >
                      {formatDate(gigForRender?.date)}, {gigForRender?.location}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: FONT_SIZES.large,
                      }}
                    >
                      {offers.length <= 1
                        ? `${offers.length} beat`
                        : `${offers.length} beats`}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    {userRole === "DJ" && hasArchivedSongs && (
                      <TouchableOpacity
                        onPress={() => {
                          setShowArchived((p) => !p);
                          closeCurrentSwipe();
                        }}
                      >
                        <Octicons
                          name={showArchived ? "eye-closed" : "eye"}
                          size={24}
                          color={showArchived ? COLORS.text : COLORS.primary}
                          style={{
                            borderWidth: 2,
                            bottom: 8,
                            padding: 12,
                            borderColor: showArchived
                              ? COLORS.text
                              : COLORS.primary,
                            borderRadius: 6,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {userRole === "Producer" &&
                    yourOffer &&
                    gigForRender?.offerOnGig?.producer.id !== userId ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.navigate("/(screens)/make-offer")}
                      >
                        <View
                          style={{
                            borderWidth: 2,
                            padding: 12,
                            borderColor: COLORS.secondary,
                            borderRadius: 6,
                            backgroundColor: "#131C21",
                            marginBottom: 18,
                          }}
                        >
                          <MaterialDesignIcons
                            name="pencil-outline"
                            size={24}
                            color={COLORS.secondary}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : null}

                    {offers.length >= 3 ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSortToggle}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            borderWidth: 2,
                            padding: 12,
                            borderColor:
                              sortMode === "new-old"
                                ? COLORS.text
                                : COLORS.primary,
                            borderRadius: 6,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#131C21",
                          }}
                        >
                          <MaterialDesignIcons
                            name="swap-vertical"
                            size={24}
                            color={
                              sortMode === "new-old"
                                ? COLORS.text
                                : COLORS.primary
                            }
                          />
                        </View>
                        <Text
                          style={{
                            color:
                              sortMode === "new-old"
                                ? COLORS.text
                                : COLORS.primary,
                            fontSize: 10,
                            marginTop: 4,
                          }}
                        >
                          {getSortLabel()}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <DjOfferLayout
                  offers={otherOffers}
                  gig={gigForRender}
                  openSwipeableRef={openSwipeableRef}
                  isLoading={isLoading}
                />
              </ScrollView>
            </View>

            {userRole === "Producer" &&
              !offers.find((o) => o.producer.id === userId) && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    position: "absolute",
                    bottom: 40,
                    left: 16,
                    right: 16,
                    borderRadius: 10,
                    overflow: "hidden",
                    elevation: 30,
                  }}
                  onPress={() => router.navigate("/(screens)/make-offer")}
                >
                  <LinearGradient
                    colors={["#50ABE0", "#5EC598"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    locations={[0.625, 1]}
                    style={{
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Submit a beat
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
          </View>
        </GestureHandlerRootView>
      </BackgroundPicture>
    </Modal>
  );
}
