import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { Chat } from "@/stores/useChatStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfilePicWIthRating from "../ui/ProfilePicWIthRating";

type ChatProps = {
  item: Chat;
  onPress: (id: string) => void;
};

const ChatItem = memo(({ item, onPress }: ChatProps) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onPress(item.producerId)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <ProfilePicWIthRating
          avatar={item.avatar}
          width={80}
          height={80}
          displayRating={false}
          border={false}
          style={{
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderLeft}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>
              {item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : ""}
            </Text>
          </View>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={COLORS.text}
          />
        </View>

        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ChatItem.displayName = "ChatItem";

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.small,
  },
  avatarContainer: {
    marginRight: SPACING.small,
    borderRightWidth: 1,
    borderRightColor: COLORS.primary,
  },
  chatInfo: {
    flexGrow: 1,
    paddingVertical: SPACING.small,
    paddingRight: SPACING.small,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  chatHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: SPACING.small,
  },
  chatName: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    flex: 1,
  },
  chatTime: {
    color: COLORS.primary,
    fontSize: 12,
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.small,
    flex: 1,
  },
});

export default ChatItem;
