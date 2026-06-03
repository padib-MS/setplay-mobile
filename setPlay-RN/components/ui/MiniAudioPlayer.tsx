import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useAudioStore } from "@/stores/useAudioStore";
import { formatTimeForAudioPlayer } from "@/utils/formatTime";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const MiniAudioPlayer: React.FC = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);

  const { selectedSong, audioUri, isPlaying, setIsPlaying } = useAudioStore();

  useEffect(() => {
    if (!audioUri) {
      setStatus(null);
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      return;
    }

    let isMounted = true;
    const sound = new Audio.Sound();
    soundRef.current = sound;

    const onStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          console.warn("Playback error:", playbackStatus.error);
        }
        if (isMounted) setStatus(null);
        return;
      }

      if (playbackStatus.didJustFinish && isMounted) {
        setIsPlaying(false);
        return;
      }

      if (isMounted) setStatus(playbackStatus);
    };

    const loadTrack = async () => {
      try {
        await sound.loadAsync({ uri: audioUri }, { shouldPlay: true }, false);
        sound.setOnPlaybackStatusUpdate(onStatusUpdate);
        setIsPlaying(true);
      } catch {
        throw new Error("Unable to load audio");
      }
    };

    loadTrack();

    return () => {
      isMounted = false;
      sound.setOnPlaybackStatusUpdate(null);
      sound.unloadAsync().catch(() => {});
      soundRef.current = null;
      setStatus(null);
    };
  }, [audioUri, setIsPlaying]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound || !status) return;

    const syncPlayback = async () => {
      try {
        const currentStatus = await sound.getStatusAsync();
        if (!currentStatus.isLoaded) return;

        if (isPlaying && !currentStatus.isPlaying) {
          await sound.playAsync();
        } else if (!isPlaying && currentStatus.isPlaying) {
          await sound.pauseAsync();
        }
      } catch {
        throw new Error("Error syncing playback");
      }
    };

    syncPlayback();
  }, [isPlaying, status]);

  if (!selectedSong || !audioUri || !status) {
    return null;
  }
  const skipForward = async () => {
    const sound = soundRef.current;
    if (!sound || !status?.durationMillis) return;

    try {
      const newPosition = Math.min(
        status.positionMillis + 10_000,
        status.durationMillis,
      );
      await sound.setPositionAsync(newPosition);
    } catch {
      throw new Error("Unable to skip forward");
    }
  };

  const skipBackward = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      await sound.setPositionAsync(Math.max(status.positionMillis - 10_000, 0));
    } catch {
      throw new Error("Unable to skip backward");
    }
  };

  const handleSeek = async (value: number) => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      const currentStatus = await sound.getStatusAsync();
      if (!currentStatus.isLoaded) return;

      await sound.setPositionAsync(value);
    } catch {
      throw new Error("Error seeking audio");
    }
  };

  const elapsedMillis = status.positionMillis ?? 0;
  const durationMillis = Math.max(status.durationMillis ?? 0, 1);
  const remainingMillis = Math.max(durationMillis - elapsedMillis, 0);
  const progress = Math.min(elapsedMillis / durationMillis, 1);

  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
        <TouchableOpacity
          onPress={skipBackward}
          style={{ marginRight: 6 }}
          activeOpacity={0.7}
        >
          <MaterialDesignIcons
            name="rewind-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.time}>
          {formatTimeForAudioPlayer(elapsedMillis / 1000)}
        </Text>

        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[COLORS.secondary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
          <Slider
            style={StyleSheet.absoluteFill}
            value={elapsedMillis}
            minimumValue={0}
            maximumValue={durationMillis}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="transparent"
            onSlidingComplete={handleSeek}
          />
        </View>

        <Text style={styles.time}>
          {`-${formatTimeForAudioPlayer(remainingMillis / 1000)}`}
        </Text>

        <TouchableOpacity
          onPress={skipForward}
          style={{ marginLeft: 6 }}
          activeOpacity={0.7}
        >
          <MaterialDesignIcons
            name="fast-forward-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiniAudioPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    width: 44,
    textAlign: "center",
  },
  progressContainer: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: `${COLORS.text}22`,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
});
