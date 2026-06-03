import { ApiGigs } from "@/api/gig/gig.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { COLORS, SPACING } from "@/constants/theme";
import { useDjStore } from "@/stores/useDjStore";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface GigActionsProps {
  isDJGig: boolean;
  gig: ApiGigs;
  hasProducer: boolean;
}

const SaveButton = React.memo(
  ({
    gigId,
    borderColor,
    gig,
  }: {
    gigId: string;
    borderColor: string;
    gig: ApiGigs;
  }) => {
    const isGigSaved = useUserStore((state) => state.isGigSaved(gigId));
    const userId = useUserStore((state) => state.user?.id);

    const handleGigSave = async () => {
      if (!userId) return;
      await useUserStore.getState().toggleSaveGig(userId, gigId, gig);
    };

    return (
      <ActionButton
        icon={
          <Ionicons
            name={isGigSaved ? "star" : "star-outline"}
            size={20}
            color={COLORS.primary}
          />
        }
        borderColor={borderColor}
        onPress={handleGigSave}
      />
    );
  },
);

SaveButton.displayName = "SaveButton";

const GigActions: React.FC<GigActionsProps> = ({
  isDJGig,
  gig,
  hasProducer,
}) => {
  const setSelectedGigForShare = useGigStore(
    (state) => state.setSelectedGigForShare,
  );
  const userRole = useUserStore((state) => state.user?.role);
  const userId = useUserStore((state) => state.user?.id);
  const cancelGig = useDjStore((state) => state.cancelGig);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleShare = () => {
    setSelectedGigForShare(gig);
    router.navigate("/(screens)/share-gig");
  };

  const borderColor = hasProducer ? COLORS.text : COLORS.primary;

  const isProducerGig =
    userRole === "Producer" &&
    gig?.offers?.djOffers.some((offer) => offer.producer.id === userId);

  const renderButtons = () => {
    if (isDJGig && !hasProducer) {
      return (
        <>
          <ActionButton
            icon={<Feather name="trash" size={20} color={COLORS.primary} />}
            borderColor={borderColor}
            onPress={() => setShowCancelDialog(true)}
          />
          <ActionButton
            icon={<Feather name="share-2" size={20} color={COLORS.primary} />}
            borderColor={borderColor}
            onPress={handleShare}
          />
        </>
      );
    }

    if ((isDJGig && hasProducer) || isProducerGig) {
      return (
        <ActionButton
          icon={<Feather name="share-2" size={20} color={COLORS.primary} />}
          borderColor={borderColor}
          onPress={handleShare}
        />
      );
    }

    return (
      <>
        <SaveButton gigId={gig.id} borderColor={borderColor} gig={gig} />
        <ActionButton
          icon={<Feather name="share-2" size={20} color={COLORS.primary} />}
          borderColor={borderColor}
          onPress={handleShare}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderButtons()}

      <ConfirmDialog
        visible={showCancelDialog}
        onDismiss={() => setShowCancelDialog(false)}
        onConfirm={() => cancelGig(gig.id)}
        title="Are you sure you want to cancel this Gig?"
        message="This action cannot be undone"
      />
    </View>
  );
};

function ActionButton({
  icon,
  borderColor,
  onPress,
}: {
  icon: React.ReactNode;
  borderColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: SPACING.small,
    flexDirection: "column",
    gap: SPACING.small,
  },
  actionButton: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GigActions;
