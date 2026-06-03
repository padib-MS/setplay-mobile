import { ApiGigs } from "@/api/gig/gig.types";
import { ApiSong } from "@/api/song/song.types";
import { modalStyles } from "@/components/ui/ModalStyles";
import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { formatTime } from "@/utils/formatTime";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer } from "expo-audio";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Separator from "./ui/Separator";

type SongCardProps = {
  song: ApiSong;
  gig?: ApiGigs;
  isSelected?: boolean;
  borderColor?: string;
  marginHorizontal?: number;
  singleDigitMode?: boolean;
  titleOrGenre?: "title" | "genre";
  style?: object;
  color?: string;
  onDelete?: (songId: string) => void;
  bpm?: number[] | number;
  songLength?: number[] | number | string;
  onCancel?: (song: ApiSong) => void;
};

export default function SongCard({
  song,
  gig,
  isSelected = false,
  borderColor,
  marginHorizontal,
  singleDigitMode = false,
  titleOrGenre = "title",
  style,
  color = COLORS.primary,
  onDelete,
  onCancel,
  bpm,
  songLength,
}: SongCardProps) {
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const selectedSongId = useAudioStore((state) => state.selectedSongId);
  const setSelectedSong = useAudioStore((state) => state.setSelectedSong);
  const togglePlayPause = useAudioStore((state) => state.togglePlayPause);
  const player = useAudioPlayer(song?.uri ?? null);
  const isActive = song?.id && song.id === selectedSongId;

  const formatName = (name?: string) =>
    name?.trim() ? name.charAt(0).toUpperCase() + name.slice(1) : "Untitled";

  const formatGenre = (genre?: string) =>
    genre?.trim() ? genre.charAt(0).toUpperCase() + genre.slice(1) : "Unknown";

  const lengthDisplay =
    songLength !== undefined
      ? Array.isArray(songLength) && songLength.length === 2
        ? `${formatTime(songLength[0])} - ${formatTime(songLength[1])}`
        : formatTime(songLength as number)
      : singleDigitMode
        ? formatTime(song.songLength)
        : gig?.songLengthRange?.length === 2
          ? `${formatTime(gig.songLengthRange[0])} - ${formatTime(
              gig.songLengthRange[1],
            )}`
          : formatTime(song.songLength);

  const bpmDisplay =
    bpm !== undefined
      ? Array.isArray(bpm) && bpm.length === 2
        ? `${bpm[0]} - ${bpm[1]}BPM`
        : `${bpm}BPM`
      : singleDigitMode
        ? song?.bpm
          ? `${song.bpm}BPM`
          : ""
        : gig?.bpmRange?.length === 2
          ? `${gig.bpmRange[0]} - ${gig.bpmRange[1]}BPM`
          : "";

  useEffect(() => {
    if (!player) return;

    const togglePlayback = async () => {
      if (isActive && isPlaying) {
        await player.play();
      } else {
        await player.pause();
      }
    };

    togglePlayback();
  }, [isActive, isPlaying, player]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setSelectedSong(song)}
      style={[
        modalStyles.input,
        styles.container,
        {
          marginHorizontal: marginHorizontal ?? 12,
          borderColor:
            borderColor ?? (isSelected ? COLORS.secondary : COLORS.primary),
        },
        style,
      ]}
    >
      {song.uri && (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedSong(song);
              togglePlayPause(song, player);
            }}
            style={styles.playButton}
          >
            <Feather
              name={isPlaying && isActive ? "pause" : "play"}
              color={COLORS.primary}
              size={20}
            />
          </TouchableOpacity>

          <Separator color={color} />
        </>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          {titleOrGenre === "title" ? (
            <>
              <MaterialCommunityIcons
                name="music-note"
                size={20}
                color={COLORS.primary}
              />
              <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatName(song.name ?? "")}
              </Text>
            </>
          ) : (
            <>
              <MaterialIcons
                name="library-music"
                size={20}
                color={COLORS.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.titleText}>
                {formatGenre(gig?.genre ?? "")}
              </Text>
            </>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Image
              source={require("@/assets/icons/songLength.svg")}
              style={styles.lengthIcon}
              placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
              contentFit="contain"
              cachePolicy="memory"
            />
            <Text style={styles.metaText}>{lengthDisplay}</Text>
          </View>

          <View style={styles.metaItem}>
            <Fontisto name="heartbeat-alt" size={16} color="#1f4e6b" />
            <Text style={styles.metaText}>{bpmDisplay}</Text>
          </View>
        </View>
      </View>

      {onDelete && !song.isExample && (
        <>
          <Separator color={COLORS.primary} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.deleteButton}
            onPress={() => onDelete(song?.id ?? "")}
          >
            <MaterialCommunityIcons
              name="delete-forever-outline"
              size={22}
              color={COLORS.alert}
            />
          </TouchableOpacity>
        </>
      )}
      {onCancel && (
        <>
          <Separator color={COLORS.primary} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.deleteButton}
            onPress={() => onCancel(song)}
          >
            <Entypo name="cross" size={22} color={COLORS.alert} />
          </TouchableOpacity>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: COLORS.background,
  },

  playButton: {
    flexDirection: "row",
    paddingHorizontal: 23,
  },

  content: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 6,
    paddingVertical: 10,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
    letterSpacing: 14 * 0.02,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  metaText: {
    color: COLORS.primary,
    marginLeft: SPACING.xSmall,
    fontSize: FONT_SIZES.small,
    fontWeight: "400",
  },

  lengthIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
    marginLeft: 2,
  },

  deleteButton: {
    marginLeft: 6,
    padding: 12,
  },
});
