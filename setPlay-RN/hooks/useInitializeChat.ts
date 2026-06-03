import { useAudioStore } from "@/stores/useAudioStore";
import { useChatStore } from "@/stores/useChatStore";
import { router } from "expo-router";

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export function useInitializeChat() {
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const stopPlayback = useAudioStore((s) => s.stopPlayback);
  const chats = useChatStore((s) => s.chats);

  const openChat = (user: ChatUser) => {
    stopPlayback();
    router.navigate("/(screens)/chat");

    if (!chats.some((c) => c.producerId === user.id)) {
      useChatStore.setState((state) => ({
        chats: [
          ...state.chats,
          {
            producerId: user.id,
            name: user.name,
            lastMessage: "",
            timestamp: new Date(),
            unread: 0,
            avatar: user.avatar,
            messages: [],
          },
        ],
      }));
    }

    setSelectedChat(user.id);
  };

  return { openChat };
}
