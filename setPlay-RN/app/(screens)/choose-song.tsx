import { ApiSong } from "@/api/song/song.types";
import { modalStyles } from "@/components/ui/ModalStyles";
import SongLayout from "@/components/ui/SongLayout";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Params = {
  gigId?: string;
};

export default function ChooseASongScreen() {
  const { gigId } = useLocalSearchParams<Params>();

  const userId = useUserStore((state) => state.user?.id);
  const setGigSong = useGigStore((state) => state.setGigSong);
  const updateGigDraft = useGigStore((state) => state.updateGigDraft);
  const setAudioSelectedSong = useAudioStore((state) => state.setSelectedSong);
  const selectedSong = useAudioStore((state) => state.selectedSong);

  const scrollRef = useRef<ScrollView>(null);

  const handleSongSubmit = (song: ApiSong) => {
    if (gigId) {
      setGigSong(song);
    }
    updateGigDraft({ song });
    setAudioSelectedSong(song);
    router.back();
  };

  useEffect(() => {
    if (userId) {
      useAudioStore.getState().loadSongs(userId);
    }
  }, [userId]);

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={() => router.back()}
      statusBarTranslucent={true}
    >
      <View style={style.modalOverlay}>
        <View style={style.modalContainer}>
          <View style={{ flex: 1, maxHeight: 350 }}>
            <View
              style={[modalStyles.column, { marginTop: 12, marginBottom: 8 }]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  modalStyles.input,
                  {
                    borderWidth: 2,
                    borderColor: COLORS.secondary,
                    justifyContent: "center",
                    padding: 14,
                  },
                ]}
                onPress={() => {
                  router.push("/(screens)/track-upload");
                }}
              >
                <Feather
                  name="upload"
                  size={20}
                  color={COLORS.secondary}
                  style={modalStyles.icon}
                />
                <Text
                  style={{
                    color: COLORS.secondary,
                    fontSize: FONT_SIZES.medium,
                  }}
                >
                  Upload new track
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView overScrollMode="never" bounces={false} ref={scrollRef}>
              <SongLayout onSongSubmit={handleSongSubmit} />
            </ScrollView>

            {selectedSong && (
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  zIndex: 10,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.primary,
                    backgroundColor: COLORS.background,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    paddingVertical: 13,
                    paddingHorizontal: 57.5,
                    shadowColor: "#000",
                  }}
                  onPress={() => handleSongSubmit(selectedSong)}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: FONT_SIZES.medium,
                      fontWeight: "400",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: 300,
    backgroundColor: "#141319",
    borderColor: COLORS.primary,
    borderWidth: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
});
