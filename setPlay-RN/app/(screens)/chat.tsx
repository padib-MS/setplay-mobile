import ArrowBack from "@/components/ui/ArrowBack";
import ChatItem from "@/components/ui/ChatItem";
import LoadInvicator from "@/components/ui/LoadIndicator";
import MessageBubble from "@/components/ui/MessageBubble";
import ProfilePicWIthRating from "@/components/ui/ProfilePicWIthRating";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { ChatService } from "@/services/ChatService";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LegendList, LegendListRef } from "@legendapp/list";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function ChatModal() {
  const isLoading = useUserStore((state) => state.loading);
  const chats = useChatStore((state) => state.chats);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const setChats = useChatStore((state) => state.setChats);
  const userId = useUserStore((state) => state.user?.id);

  const [message, setMessage] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const messagesListRef = useRef<LegendListRef>(null);
  const chatsListRef = useRef<LegendListRef>(null);
  const chatServiceRef = useRef<ChatService | null>(null);

  const selectedChat = chats.find((c) => c.producerId === selectedChatId);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const service = new ChatService(userId);
    chatServiceRef.current = service;

    service.onReceiveMessage((msg) => {
      const partnerId =
        msg.senderId === userId ? msg.recipientId : msg.senderId;
      useChatStore.getState().addMessage(partnerId, msg);
    });

    return () => {
      service.disconnect();
      chatServiceRef.current = null;
    };
  }, [userId]);

  useEffect(() => {
    (async () => {
      if (!chatServiceRef.current) return;

      const history = await chatServiceRef.current.getChatHistory();
      if (history) setChats(history);
    })();
  }, [chatServiceRef.current]);

  const chatMessages = selectedChatId
    ? (chats.find((c) => c.producerId === selectedChatId)?.messages ?? [])
    : [];

  const sendMessage = async () => {
    if (!message.trim() || !selectedChatId) return;
    await chatServiceRef.current?.sendMessage(selectedChatId, message);
    setMessage("");
  };

  return (
    <Modal
      transparent
      visible={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        setSelectedChat(null);
        router.back();
      }}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          Keyboard.dismiss();
          setSelectedChat(null);
          router.back();
        }}
      />

      <BlurView
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        intensity={10}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <View
            style={[
              styles.chatWrapper,
              { justifyContent: keyboardOpen ? "flex-end" : "center" },
            ]}
          >
            <ArrowBack onPress={() => router.back()} icon="close" />

            <View style={styles.chatContainer}>
              {selectedChatId ? (
                <View style={styles.header}>
                  <Pressable
                    onPress={() => setSelectedChat(null)}
                    style={styles.backButton}
                  >
                    <MaterialIcons
                      name="keyboard-arrow-left"
                      size={24}
                      color={COLORS.text}
                    />
                  </Pressable>

                  <View style={styles.headerInfo}>
                    <ProfilePicWIthRating
                      avatar={selectedChat?.avatar}
                      width={40}
                      height={40}
                      displayRating={false}
                      border={false}
                      style={styles.headerAvatar}
                    />
                    <Text style={styles.headerTitle}>{selectedChat?.name}</Text>
                  </View>
                </View>
              ) : null}

              <LoadInvicator isLoading={isLoading} />

              {!selectedChatId && !isLoading ? (
                <View style={styles.listWrapper}>
                  <LegendList
                    ref={chatsListRef}
                    showsVerticalScrollIndicator={false}
                    data={chats}
                    keyExtractor={(item) => item.producerId}
                    renderItem={({ item }) => (
                      <ChatItem item={item} onPress={setSelectedChat} />
                    )}
                    recycleItems={true}
                    contentContainerStyle={styles.chatList}
                    estimatedItemSize={150}
                  />
                </View>
              ) : (
                <>
                  {!isLoading && (
                    <View style={styles.listWrapper}>
                      <LegendList
                        ref={messagesListRef}
                        showsVerticalScrollIndicator={false}
                        data={chatMessages}
                        keyExtractor={(_, i) => i.toString()}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => <MessageBubble item={item} />}
                        recycleItems={true}
                        contentContainerStyle={styles.messagesList}
                        estimatedItemSize={100}
                        onContentSizeChange={() => {
                          messagesListRef.current?.scrollToEnd({
                            animated: false,
                          });
                        }}
                      />
                    </View>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={message}
                      onChangeText={setMessage}
                      placeholderTextColor={COLORS.primary}
                      multiline
                      textAlignVertical="top"
                    />

                    <Pressable
                      onPress={sendMessage}
                      disabled={!message.trim()}
                      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                    >
                      <LinearGradient
                        colors={["#50ABE0", "#5EC598"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        locations={[0.625, 1]}
                        style={styles.sendButtonGradient}
                      >
                        <MaterialDesignIcons
                          name="send-variant-outline"
                          size={24}
                          color={COLORS.text}
                        />
                      </LinearGradient>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  chatWrapper: { flex: 1, paddingHorizontal: 24 },
  chatContainer: {
    height: "85%",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    padding: SPACING.xSmall,
    borderBottomColor: COLORS.primary,
  },
  backButton: {
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 3,
    backgroundColor: COLORS.background,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    gap: SPACING.small,
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  headerAvatar: { borderWidth: 1, borderColor: COLORS.primary },
  headerTitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: "600",
  },
  listWrapper: { flex: 1 },
  chatList: { padding: SPACING.small },
  messagesList: { padding: SPACING.medium },
  inputContainer: {
    flexDirection: "row",
    padding: SPACING.xSmall,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
  },
  input: {
    flex: 1,
    borderRadius: 6,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    marginRight: SPACING.xSmall,
    backgroundColor: COLORS.background,
  },
  sendButtonGradient: {
    borderRadius: 6,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
