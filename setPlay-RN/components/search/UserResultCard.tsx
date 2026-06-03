import { ProfileCard } from "@/api/user/user.types";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ProfilePicWIthRating from "../ui/ProfilePicWIthRating";

type Props = {
  user: ProfileCard;
  onPress: (userId: string) => void;
};

export function UserResultCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress(user.id)} activeOpacity={0.8}>
      <ImageBackground
        source={require("@/assets/images/people-search-bg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <ProfilePicWIthRating
          avatar={user.avatar}
          width={48}
          height={48}
          displayRating={false}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.ratingText}>
            {user.producerRating ? (
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>
                  {user.producerRating.toFixed(1)}
                </Text>
                <Ionicons name="star" size={10} color="#FFD700" />
              </View>
            ) : (
              <Text style={styles.ratingText}>New</Text>
            )}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginBottom: SPACING.small,
    paddingRight: SPACING.small,
  },
  avatar: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRadius: 0,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.small,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  ratingText: {
    color: COLORS.primary,
    fontSize: 12,
  },
});
