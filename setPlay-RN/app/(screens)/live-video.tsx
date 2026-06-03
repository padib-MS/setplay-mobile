import ArrowBack from "@/components/ui/ArrowBack";
import LoadIndicator from "@/components/ui/LoadIndicator";
import Separator from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";
import { COLORS } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { CameraView } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LiveVideoModal() {
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const { videoUrl: videoUrlParam } = useLocalSearchParams<{
    videoUrl: string;
  }>();
  const producerIdFromStore = useGigStore(
    (s) =>
      s.gigsByTab["my"].find((g) => g.id === s.selectedGigId)?.producer?.id,
  );
  const addVideoToGig = useGigStore((s) => s.addVideoToGig);
  const userRole = useUserStore((s) => s.user?.role);
  const userId = useUserStore((s) => s.user?.id);

  const activeVideoUri = recordedVideo ?? videoUrlParam ?? null;
  const player = useVideoPlayer(activeVideoUri ?? "");

  useEffect(() => {
    if (!activeVideoUri) return;
    player.play();
  }, [activeVideoUri]);

  const handleRecordPress = async () => {
    if (!cameraRef.current) return;
    try {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
        if (video?.uri) setRecordedVideo(video.uri);
        setIsRecording(false);
      }
    } catch {
      setIsRecording(false);
    }
  };

  const handleAccept = async () => {
    if (!recordedVideo) return;
    setIsLoadingVideo(true);
    await addVideoToGig(recordedVideo);
    setIsLoadingVideo(false);
    setRecordedVideo(null);
    router.back();
  };

  const handleDeny = () => setRecordedVideo(null);

  const handleClose = async () => {
    if (isRecording && cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
    setRecordedVideo(null);
    router.back();
  };

  const renderContent = () => {
    if (isLoadingVideo) {
      return (
        <View style={styles.loadingContainer}>
          <LoadIndicator isLoading={true} />
        </View>
      );
    }

    if (recordedVideo || videoUrlParam) {
      return (
        <>
          <VideoView
            player={player}
            style={styles.video}
            fullscreenOptions={{ enable: true }}
            allowsPictureInPicture
            contentFit="cover"
          />
          {recordedVideo && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAccept}
                activeOpacity={0.6}
              >
                <MaterialDesignIcons
                  name="check"
                  size={40}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Separator color={COLORS.primary} />
              <TouchableOpacity
                style={styles.denyButton}
                onPress={handleDeny}
                activeOpacity={0.6}
              >
                <MaterialDesignIcons
                  name="close"
                  size={40}
                  color={COLORS.alert}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      );
    }

    return (
      <>
        <CameraView
          ref={cameraRef}
          style={styles.video}
          facing="back"
          mode="video"
          ratio="16:9"
        />
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecordPress}
          activeOpacity={0.7}
        >
          <MaterialDesignIcons
            name={isRecording ? "stop-circle" : "record-circle-outline"}
            size={60}
            color={isRecording ? COLORS.alert : COLORS.primary}
          />
        </TouchableOpacity>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>REC</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={10}
        tint="dark"
        style={styles.overlay}
      >
        {videoUrlParam &&
        userRole === "Producer" &&
        userId === producerIdFromStore ? (
          <ArrowBack onPress={() => router.navigate("/(screens)/rate-role")} />
        ) : (
          <ArrowBack />
        )}

        <View style={styles.videoCard}>{renderContent()}</View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoCard: {
    width: width * 0.92,
    height: height * 0.75,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  recordButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  recordingIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.alert,
    marginRight: 6,
  },
  recordingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButtons: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  acceptButton: {
    width: 40,
    height: 40,
  },
  denyButton: {
    width: 40,
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
