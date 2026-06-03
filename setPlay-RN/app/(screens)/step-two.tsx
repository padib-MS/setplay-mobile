import { ApiPostGigRequest } from "@/api/dj/dj.types";
import SongCard from "@/components/SongCard";
import ArrowBack from "@/components/ui/ArrowBack";
import GenreSelector from "@/components/ui/GenreSelector";
import { modalStyles } from "@/components/ui/ModalStyles";
import Slider from "@/components/ui/Slider";
import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH, LOCATIONS } from "@/constants/constants";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useDjStore } from "@/stores/useDjStore";
import { useGigStore } from "@/stores/useGigStore";
import { formatTime } from "@/utils/formatTime";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StepTwoModal() {
  const pathname = usePathname();
  const isChooseSongOpen = pathname.includes("choose-song");

  const setSelectedSong = useAudioStore((state) => state.setSelectedSong);
  const stopPlayback = useAudioStore((state) => state.stopPlayback);
  const updateGigStepTwo = useGigStore((state) => state.updateGigDraft);
  const gigDraft = useGigStore((state) => state.gigDraft);
  const commitGigDraft = useGigStore((state) => state.commitGigDraft);
  const addGigToDj = useDjStore((state) => state.addGig);

  const handleCompleteSetup = async () => {
    const venueName = gigDraft?.location?.split(",")[0]?.trim();

    const backendGigData: ApiPostGigRequest = {
      location: gigDraft?.location!,
      date: gigDraft?.dateISO || new Date(Date.now() + 86400000).toISOString(),
      eventName: venueName!,
      time: gigDraft?.time!,
      venue: gigDraft?.venue!,
      bid: 45,
      backgroundImage: LOCATIONS.find((loc) => loc.name === gigDraft?.location)
        ?.backgroundPictureUrl!,
      songId: gigDraft?.song?.id!,
      songLengthRange: gigDraft?.songLengthRange || [104, 240],
      bpmRange: gigDraft?.bpmRange || [80, 150],
      genre: gigDraft?.genre!,
    };

    try {
      await addGigToDj(backendGigData);
      commitGigDraft();
      stopPlayback();
      setSelectedSong(null);

      router.dismissAll();
    } catch (error) {
      throw error;
    }
    console.log(backendGigData);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={() => router.dismissAll()}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={10}
          tint="dark"
          style={StyleSheet.absoluteFill}
        >
          <TouchableWithoutFeedback onPress={() => router.dismissAll()}>
            <View
              style={[
                modalStyles.modalOverlay,
                {
                  justifyContent: isChooseSongOpen ? "flex-start" : "center",
                },
              ]}
            >
              <ArrowBack
                onPress={() => router.navigate("/(screens)/step-one")}
              />
              <View style={modalStyles.modalContainer}>
                <View style={[modalStyles.column, { marginBottom: 0 }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      modalStyles.input,
                      {
                        borderWidth: 2,
                        justifyContent: "center",
                        paddingVertical: 14,
                      },
                    ]}
                    onPress={() => {
                      router.navigate("/(screens)/choose-song");
                    }}
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
                      Choose a Song Example
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    modalStyles.column,
                    { marginTop: 6, marginBottom: 6 },
                  ]}
                >
                  {gigDraft?.song && (
                    <SongCard
                      song={gigDraft.song}
                      isSelected
                      singleDigitMode={true}
                      borderColor={COLORS.primary}
                      onCancel={() => {
                        setSelectedSong(null);
                        updateGigStepTwo({ song: undefined });
                      }}
                    />
                  )}
                </View>

                <GenreSelector
                  selectedGenre={gigDraft?.genre!}
                  onGenreSelect={(genre) => updateGigStepTwo({ genre })}
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
                        values={gigDraft?.bpmRange || [80, 150]}
                        min={70}
                        max={200}
                        step={5}
                        onValuesChange={(values) =>
                          updateGigStepTwo({
                            bpmRange: [values[0], values[1]],
                          })
                        }
                        icons={
                          <Fontisto
                            name="heartbeat-alt"
                            size={20}
                            color="#5f7c61"
                          />
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </View>

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
                        title="Song Length"
                        values={gigDraft?.songLengthRange || [104, 240]}
                        min={0}
                        max={601}
                        step={1}
                        onValuesChange={(values) =>
                          updateGigStepTwo({
                            songLengthRange: [values[0], values[1]],
                          })
                        }
                        formatValue={formatTime}
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
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    modalStyles.nextButton,
                    (!gigDraft?.genre || !gigDraft?.song) &&
                      modalStyles.nextButtonDisabled,
                  ]}
                  disabled={!gigDraft?.genre || !gigDraft?.song}
                  onPress={handleCompleteSetup}
                >
                  <Text style={modalStyles.nextButtonText}>
                    Complete GIG Setup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
}
