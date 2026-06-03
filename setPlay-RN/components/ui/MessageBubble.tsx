import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { ChatMessage } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  item: ChatMessage;
};

const MessageBubble = memo(({ item }: Props) => {
  const userId = useUserStore((state) => state.user?.id);
  const isMine = item.senderId === userId;

  return (
    <View
      style={[
        styles.messageBubble,
        isMine ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          isMine ? styles.myMessageText : styles.otherMessageText,
        ]}
      >
        {item.messageText}
      </Text>
    </View>
  );
});

MessageBubble.displayName = "MessageBubble";

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "75%",
    padding: SPACING.small,
    borderRadius: 16,
    marginVertical: SPACING.xSmall,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  messageText: {
    fontSize: FONT_SIZES.small,
  },
  myMessageText: {
    color: COLORS.text,
  },
  otherMessageText: {
    color: COLORS.secondary,
  },
});

export default MessageBubble;
