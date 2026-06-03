import { create } from "zustand";

export interface Chat {
  producerId: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  senderId: string;
  messageText: string;
}

interface ChatStore {
  selectedChatId: string | null;
  chats: Chat[];
  setSelectedChat: (chatId: string | null) => void;
  setChats: (chats: Chat[]) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: null,
  chats: [],

  setSelectedChat: (producerId) => {
    set({ selectedChatId: producerId });
  },

  setChats: (chats) => set({ chats }),

  addMessage: (producerId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.producerId === producerId
          ? {
              ...chat,
              lastMessage: message.messageText,
              timestamp: new Date(),
              messages: [...(chat.messages ?? []), message],
            }
          : chat,
      ),
    })),
}));
