import { ApiGigs } from "@/api/gig/gig.types";
import { CTAConfig } from "@/components/ui/CTAButton";
import { COLORS } from "@/constants/theme";
import { useNumberOfOffers } from "@/hooks/useNumberOfOffers";
import { useGigStore } from "@/stores/useGigStore";
import { useProducerStore } from "@/stores/useProducerStore";
import { useUserStore } from "@/stores/useUserStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useMemo } from "react";

interface UseCTAConfigParams {
  gig: ApiGigs;
  isDJGig: boolean;
  hasProducer: boolean;
  handlePress: () => void;
  handleFootagePress: () => void;
  handleVideoPress: () => Promise<void>;
}

export const useCTAConfig = ({
  gig,
  isDJGig,
  hasProducer,
  handlePress,
  handleFootagePress,
  handleVideoPress,
}: UseCTAConfigParams): CTAConfig | null => {
  const userRole = useUserStore((s) => s.user?.role);
  const userId = useUserStore((s) => s.user?.id);
  const producerId = useProducerStore((s) => s.producerId);
  const { getNumberOfOffers, filteredList } = useNumberOfOffers(true);
  const setSelectedGigId = useGigStore((s) => s.setSelectedGig);

  return useMemo(() => {
    const numberOfOffers = getNumberOfOffers(gig.id);

    const hasSubmitted = gig.offers?.djOffers?.some(
      (o) => o.producer.id === userId,
    );

    const producerOffersCount =
      filteredList.find((g) => g.id === gig.id)?.offers?.djOffers?.length ?? 0;

    if (userRole === "Producer") {
      if (gig.dj?.id === producerId) {
        return null;
      }
      if (hasSubmitted) {
        if (gig.hasVideo) {
          return {
            type: "full-gradient",
            mainContent: {
              text: "Accept",
              textColor: COLORS.text,
            },
            onPress: () => handleVideoPress(),
          };
        }

        return {
          type: "split-gradient",
          sidePill: {
            text: String(producerOffersCount),
            icon: (
              <MaterialIcons name="gavel" size={16} color={COLORS.secondary} />
            ),
            textColor: COLORS.secondary,
          },
          mainContent: {
            text: "Manage Submission",
            textColor: COLORS.text,
          },
          onPress: handlePress,
          onMainPress: handlePress,
        };
      }

      return {
        type: "split-gradient",
        sidePill: {
          text: `${gig.bid}$`,
          textColor: COLORS.secondary,
        },
        mainContent: {
          text: "Submit a Beat",
          textColor: COLORS.text,
        },
        onPress: handlePress,
        onMainPress: handlePress,
      };
    }

    if (userRole === "DJ" && isDJGig) {
      if (!hasProducer) {
        return {
          type: "split-gradient",
          sidePill: {
            text: `${gig.bid}$`,
            textColor: COLORS.secondary,
          },
          mainContent: {
            text: String(numberOfOffers),
            icon: (
              <MaterialIcons name="gavel" size={20} color={COLORS.secondary} />
            ),
            textColor: COLORS.secondary,
          },
          onPress: () => {
            if (numberOfOffers >= 1) handlePress();
          },
          disabled: numberOfOffers < 1,
        };
      }

      if (!gig.hasVideo) {
        return {
          type: "full-gradient",
          mainContent: {
            text: "Record Live Footage",
            textColor: COLORS.text,
          },
          onPress: handleFootagePress,
        };
      }

      if (!gig.hasDjRated) {
        return {
          type: "full-gradient",
          mainContent: {
            text: "Rate Producer Track",
            textColor: COLORS.text,
          },
          onPress: () => {
            setSelectedGigId(gig.id);
            router.navigate("/(screens)/rate-role");
          },
        };
      }

      return {
        type: "full-gradient",
        mainContent: {
          text: "Pending Verification",
          textColor: COLORS.text,
        },
        onPress: () => {},
        disabled: true,
      };
    }

    return null;
  }, [
    userRole,
    userId,
    producerId,
    isDJGig,
    hasProducer,
    gig,
    filteredList,
    getNumberOfOffers,
    handlePress,
    handleFootagePress,
    handleVideoPress,
    setSelectedGigId,
  ]);
};
