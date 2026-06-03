import { ApiGigs } from "@/api/gig/gig.types";
import { ApiOffer } from "@/api/offer/offer.types";
import { Text } from "@/components/ui/Text";
import { COLORS } from "@/constants/theme";
import { useInitializeChat } from "@/hooks/useInitializeChat";
import { useAudioStore } from "@/stores/useAudioStore";
import { useDjStore } from "@/stores/useDjStore";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import Feather from "@expo/vector-icons/Feather";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import LoadingIndicator from "../ui/LoadIndicator";
import OfferCard from "../ui/OfferCard";

const ACTION_WIDTH = 48;

interface DjOfferLayoutProps {
  offers: ApiOffer[];
  gig: ApiGigs | undefined;
  openSwipeableRef: React.MutableRefObject<Swipeable | null>;
  isLoading?: boolean;
}

const DjOfferLayout: React.FC<DjOfferLayoutProps> = ({
  offers,
  gig,
  openSwipeableRef,
  isLoading = false,
}) => {
  const stopPlayback = useAudioStore((s) => s.stopPlayback);
  const toggleOfferSongArchive = useGigStore((s) => s.toggleOfferSongArchive);

  const acceptOffer = useDjStore((s) => s.acceptOffer);
  const { openChat } = useInitializeChat();
  const userRole = useUserStore((s) => s.user?.role);

  const selectedOfferId = gig?.offerOnGig?.id;

  const closeActiveSwipeable = useCallback(() => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  }, [openSwipeableRef]);

  const renderLeftActions = (offerId: string) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={async () => {
        await acceptOffer(offerId, gig!.id);
        router.back();
        stopPlayback();
      }}
      style={{ flexDirection: "row", marginRight: 4 }}
    >
      <LinearGradient
        colors={["#50ABE0", "#5EC598"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        locations={[0.625, 1]}
        style={styles.actionButton}
      >
        <Feather name="check" size={24} color="#FFD700" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRightActions = (offerId: string, archived?: boolean) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (!gig) return;
        toggleOfferSongArchive(gig.id, offerId);
        closeActiveSwipeable();
      }}
      style={{ flexDirection: "row", marginLeft: 4 }}
    >
      <LinearGradient
        colors={["#50ABE0", "#5EC598"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        locations={[0.625, 1]}
        style={styles.actionButton}
      >
        <Octicons
          name={archived ? "eye" : "eye-closed"}
          size={24}
          color="#FFD700"
        />
        <Text style={styles.actionText}>{archived ? "Unhide" : "Hide"}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />

      {!isLoading &&
        offers.map((offer) => {
          let swipeInstance: Swipeable | null = null;
          const isSelected = offer.id === selectedOfferId;
          const borderColor = isSelected ? "#FFD700" : COLORS.primary;

          if (userRole === "Producer") {
            return (
              <View key={offer.id}>
                <OfferCard
                  offer={offer}
                  isSelected={isSelected}
                  isArchived={offer.song.isArchived}
                  borderColor={borderColor}
                  onChatPress={() =>
                    openChat({
                      id: offer.producer.id,
                      name: offer.producer.name,
                      avatar: offer.producer.avatar,
                    })
                  }
                />
              </View>
            );
          }

          return isSelected ? (
            <View key={offer.id}>
              <MaterialDesignIcons
                name="crown-outline"
                size={30}
                color="#FFD700"
                style={{ marginHorizontal: "auto" }}
              />
              <OfferCard
                offer={offer}
                isSelected={isSelected}
                isArchived={offer.song.isArchived}
                borderColor={borderColor}
                onChatPress={() =>
                  openChat({
                    id: offer.producer.id,
                    name: offer.producer.name,
                    avatar: offer.producer.avatar,
                  })
                }
              />
            </View>
          ) : (
            <Swipeable
              key={offer.id}
              ref={(ref) => {
                if (ref) swipeInstance = ref;
              }}
              friction={3}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={() => renderLeftActions(offer.id)}
              renderRightActions={() =>
                renderRightActions(offer.id, offer.song.isArchived)
              }
              onSwipeableOpen={() => {
                if (
                  openSwipeableRef.current &&
                  openSwipeableRef.current !== swipeInstance
                ) {
                  openSwipeableRef.current.close();
                }
                openSwipeableRef.current = swipeInstance;
              }}
            >
              <OfferCard
                offer={offer}
                isSelected={isSelected}
                isArchived={offer.song.isArchived}
                borderColor={borderColor}
                onChatPress={() =>
                  openChat({
                    id: offer.producer.id,
                    name: offer.producer.name,
                    avatar: offer.producer.avatar,
                  })
                }
              />
            </Swipeable>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 12,
  },
  actionText: {
    color: "#FFD700",
    fontSize: 10,
  },
});

export default DjOfferLayout;
