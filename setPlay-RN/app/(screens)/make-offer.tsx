import SongCard from "@/components/SongCard";
import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import { modalStyles } from "@/components/ui/ModalStyles";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGigStore } from "@/stores/useGigStore";
import { useProducerStore } from "@/stores/useProducerStore";
import { useUserStore } from "@/stores/useUserStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function MakeOfferModal() {
  const selectedGigId = useGigStore((state) => state.selectedGigId);
  const loadMyGigs = useGigStore((state) => state.loadMyGigs);
  const userId = useUserStore((state) => state.user?.id) || "";
  const putOffer = useProducerStore((state) => state.putOffer);
  const selectedSong = useAudioStore((state) => state.selectedSong);
  const setSelectedSong = useAudioStore((state) => state.setSelectedSong);

  useEffect(() => {
    if (userId) {
      useAudioStore.getState().loadSongs(userId);
    }
  }, [userId]);

  return (
    <BackgroundPicture bgImage={require("@/assets/images/offers-bg.webp")}>
      <View style={style.modalWrapper}>
        <ArrowBack
          onPress={() => router.navigate("/(screens)/gig-card")}
          style={{ marginLeft: 12 }}
        />
        <View style={style.modalContainer}>
          {selectedSong ? (
            <View style={{ marginVertical: 12 }}>
              <SongCard
                song={selectedSong}
                isSelected
                singleDigitMode={true}
                borderColor={COLORS.primary}
                onDelete={() => {
                  setSelectedSong?.(null);
                }}
              />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                modalStyles.input,
                {
                  borderWidth: 2,
                  borderRadius: 6,
                  paddingVertical: 14,
                  backgroundColor: "#131C21",
                  marginVertical: 12,
                  justifyContent: "center",
                },
              ]}
              onPress={() => router.navigate("/(screens)/choose-song")}
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={20}
                color={COLORS.primary}
                style={modalStyles.icon}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: FONT_SIZES.medium,
                }}
              >
                Choose track
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            style={{ overflow: "hidden" }}
            disabled={!selectedSong}
            onPress={async () => {
              if (!selectedGigId || !selectedSong) return;
              await putOffer(userId, selectedGigId, selectedSong.id!);
              await loadMyGigs();
              setSelectedSong(null);
              router.navigate("/(screens)/gig-card");
            }}
          >
            {selectedSong ? (
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
                    fontSize: FONT_SIZES.medium,
                    fontWeight: "600",
                    letterSpacing: FONT_SIZES.medium * 0.02,
                  }}
                >
                  Submit a beat
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  paddingVertical: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#bbbbbb",
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: FONT_SIZES.medium,
                    fontWeight: "600",
                    letterSpacing: FONT_SIZES.medium * 0.02,
                  }}
                >
                  Submit a beat
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundPicture>
  );
}

const style = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    flexShrink: 1,
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
});
