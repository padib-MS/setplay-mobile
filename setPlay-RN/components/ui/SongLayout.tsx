import { modalStyles } from "@/components/ui/ModalStyles";
import { COLORS, SPACING } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import { View } from "react-native";
import SongCard from "../SongCard";

interface SongLayoutProps {
  onSongSubmit?: (song: any) => void;
}

const SongLayout: React.FC<SongLayoutProps> = ({ onSongSubmit }) => {
  const songs = useAudioStore((state) => state.songs) || [];
  const togglePlayPause = useAudioStore((state) => state.togglePlayPause);
  const deleteSong = useAudioStore((state) => state.deleteSong);
  const audioUri = useAudioStore((state) => state.audioUri);
  const selectedSongId = useAudioStore((state) => state.selectedSongId);
  const player = useAudioPlayer(audioUri || null);

  return (
    <View style={modalStyles.column}>
      {songs.length > 0 && (
        <View style={{ gap: SPACING.small }}>
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isSelected={selectedSongId === song.id}
              borderColor={
                selectedSongId === song.id ? COLORS.secondary : COLORS.primary
              }
              singleDigitMode={true}
              onDelete={(songId) => {
                if (songId) {
                  deleteSong(songId, player);
                }
                if (audioUri === song.uri) {
                  togglePlayPause(song, player);
                }
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default SongLayout;
