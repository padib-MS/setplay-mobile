import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { useModeStore } from "@/stores/useModeStore";
import { useUserStore } from "@/stores/useUserStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfilePicWithRating from "./ProfilePicWIthRating";
import SearchContainer from "./SearchContainer";

const ModeButton = React.memo(() => {
  const toggleMode = useModeStore((state) => state.toggleMode);
  const currentMode = useModeStore((state) => state.currentMode);

  const handleToggle = () => {
    toggleMode();
    setTimeout(() => {
      const newMode = useModeStore.getState().currentMode;
      useGigStore
        .getState()
        .loadAllGigs({ showCompleted: newMode === "viewer" });
    }, 0);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.outerBorder}
      onPress={handleToggle}
    >
      {currentMode === "business" ? (
        <LinearGradient
          colors={["#50ABE0", "#5EC598"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          locations={[0.625, 1]}
          style={styles.gradientButton}
        >
          <Image
            source={require("@/assets/icons/dollar.svg")}
            placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
            contentFit="contain"
            style={{ width: 20, height: 20 }}
            cachePolicy="memory"
          />
        </LinearGradient>
      ) : (
        <View style={styles.normalButton}>
          <Image
            style={{ tintColor: COLORS.primary, width: 20, height: 20 }}
            source={require("@/assets/icons/dollar.svg")}
            placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
            contentFit="contain"
            cachePolicy="memory"
          />
        </View>
      )}
    </TouchableOpacity>
  );
});

ModeButton.displayName = "ModeButton";

const UploadButton = React.memo(() => {
  const userRole = useUserStore((state) => state.user?.role);
  const currentMode = useModeStore((state) => state.currentMode);

  if (userRole !== "DJ" || currentMode !== "business") return null;

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/(screens)/step-one")}
      activeOpacity={0.8}
    >
      <View style={styles.iconSpacing}>
        <Image
          source={require("@/assets/icons/Upload.svg")}
          style={{ width: 24, height: 24 }}
          transition={100}
          contentFit="cover"
          cachePolicy="memory"
          placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
        />
      </View>
    </TouchableOpacity>
  );
});

UploadButton.displayName = "UploadButton";

const Header: React.FC = () => {
  const userName = useUserStore((state) => state.user?.name);
  const userId = useUserStore((state) => state.user?.id);
  const fetchSavedGigs = useUserStore((state) => state.fetchSavedGigs);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.header}
          onPress={() => router.navigate("/(screens)/burger-menu")}
        >
          <ProfilePicWithRating
            width={48}
            height={48}
            smallOrLarge="small"
            border={true}
            displayRating={false}
          />
          <Text style={styles.profileName}>{userName}</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <UploadButton />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.navigate("/(screens)/chat")}
          >
            <View style={styles.iconSpacing}>
              <Image
                source={require("@/assets/icons/Chat.svg")}
                style={{ width: 24, height: 24 }}
                transition={100}
                contentFit="cover"
                cachePolicy="memory"
                placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.navigate("/(screens)/save-gig");
              fetchSavedGigs(userId!);
            }}
          >
            <View style={styles.iconSpacing}>
              <Image
                source={require("@/assets/icons/Bookmark.svg")}
                style={{ width: 24, height: 24 }}
                transition={100}
                contentFit="cover"
                cachePolicy="memory"
                placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <SearchContainer type="modal" />
        <ModeButton />
      </View>
    </>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  profileName: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.small,
    alignSelf: "center",
  },
  headerIcons: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  iconSpacing: {
    borderWidth: 1,
    padding: 11,
    marginLeft: SPACING.small,
    borderColor: COLORS.primary,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.small,
  },
  outerBorder: {
    marginLeft: SPACING.small,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientButton: {
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  normalButton: {
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.background,
    backgroundColor: COLORS.background,
  },
});
