import { ApiSongPost } from "@/api/song/song.types";
import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import GenreSelector from "@/components/ui/GenreSelector";
import { modalStyles } from "@/components/ui/ModalStyles";
import Slider from "@/components/ui/Slider";
import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useUserStore } from "@/stores/useUserStore";
import { formatTime } from "@/utils/formatTime";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAudioPlayer } from "expo-audio";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function TrackUploadModal() {
  const { audioName, pickFile, addSong, resetSong, audioUri, pendingFile } =
    useAudioStore();
  const player = useAudioPlayer(audioUri || null);
  const userId = useUserStore((state) => state.user?.id);
  const songDraft = useAudioStore((state) => state.songDraft);
  const updateSongDraft = useAudioStore((state) => state.updateSongDraft);
  const commitSongDraft = useAudioStore((state) => state.commitSongDraft);

  const handleUpload = async () => {
    const songData: ApiSongPost = {
      name: songDraft?.name!,
      genre: songDraft?.genre!,
      bpm: songDraft?.bpm!,
      songLength: songDraft?.songLength!,
      uri: pendingFile?.uri!,
    };

    try {
      await addSong(songData, userId!);
      resetSong(player);

      router.back();
      commitSongDraft();
    } catch (error) {
      throw error;
    }
  };

  return (
    <BackgroundPicture bgImage={require("@/assets/images/offers-bg.webp")}>
      <View
        style={{
          ...modalStyles.modalOverlay,
          paddingTop: 0,
          justifyContent: "center",
        }}
      >
        <ArrowBack />
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.column}>
            <View style={[modalStyles.input, { paddingVertical: 6 }]}>
              <MaterialCommunityIcons
                name="music-note"
                size={24}
                color={COLORS.primary}
              />
              <TextInput
                style={{
                  color: COLORS.text,
                  flex: 1,
                  fontSize: FONT_SIZES.small,
                }}
                value={songDraft?.name}
                onChangeText={(text) =>
                  updateSongDraft({ ...songDraft, name: text })
                }
                placeholder="Song Name"
                placeholderTextColor={COLORS.primary}
                maxLength={30}
              />
            </View>
          </View>

          <View style={modalStyles.column}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                modalStyles.input,
                {
                  borderWidth: 2,
                  paddingVertical: 16,
                  justifyContent: "center",
                },
              ]}
              onPress={pickFile}
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={20}
                color={COLORS.primary}
                style={style.icon}
              />
              <Text
                style={{ color: COLORS.primary, fontSize: FONT_SIZES.medium }}
              >
                Attach file
              </Text>
            </TouchableOpacity>

            {pendingFile && audioName && (
              <View style={{ marginHorizontal: 12 }}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 10,
                    textDecorationLine: "underline",
                  }}
                >
                  {audioName}
                </Text>
              </View>
            )}
          </View>

          <GenreSelector
            selectedGenre={songDraft?.genre!}
            onGenreSelect={(genre) => updateSongDraft({ ...songDraft, genre })}
          />

          <View style={modalStyles.column}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                modalStyles.input,
                {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingVertical: 6,
                },
              ]}
            >
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Slider
                  title="BPM"
                  values={songDraft?.bpm || 80}
                  min={70}
                  max={200}
                  step={5}
                  singleValue={true}
                  onValuesChange={(values) => {
                    if (songDraft) {
                      updateSongDraft({ ...songDraft, bpm: values[0] });
                    }
                  }}
                  icons={
                    <Fontisto name="heartbeat-alt" size={20} color="#5f7c61" />
                  }
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={modalStyles.column}>
            <View
              style={[
                modalStyles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 6,
                },
              ]}
            >
              <Slider
                title="Song Length"
                values={songDraft?.songLength || 160}
                min={0}
                max={601}
                step={1}
                formatValue={formatTime}
                singleValue={true}
                onValuesChange={(values) =>
                  updateSongDraft({ ...songDraft, songLength: values[0] })
                }
                icons={
                  <Image
                    source={require("@/assets/icons/songLength.svg")}
                    style={{ width: 20, height: 20 }}
                    placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                    contentFit="contain"
                    cachePolicy="memory"
                  />
                }
              />
            </View>
          </View>

          <View style={[modalStyles.column, { marginBottom: 0 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                modalStyles.input,
                {
                  borderWidth: 2,
                  marginHorizontal: 0,
                  borderColor: COLORS.secondary,
                  justifyContent: "center",
                  padding: 14,
                },
                (!songDraft?.name ||
                  !songDraft?.genre ||
                  !audioName ||
                  !songDraft?.songLength ||
                  !songDraft?.bpm ||
                  !pendingFile?.uri) &&
                  modalStyles.nextButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={
                !songDraft?.name ||
                !songDraft?.genre ||
                !audioName ||
                !songDraft?.songLength ||
                !songDraft?.bpm ||
                !pendingFile?.uri
              }
            >
              <Feather
                name="upload"
                size={20}
                color={COLORS.secondary}
                style={style.icon}
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
        </View>
      </View>
    </BackgroundPicture>
  );
}

const style = StyleSheet.create({
  icon: {
    marginRight: SPACING.xSmall,
  },
});
