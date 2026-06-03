import { Chat } from "@/stores/useChatStore";
import * as signalR from "@microsoft/signalr";

export interface ChatMessage {
  senderId: string;
  recipientId: string;
  messageText: string;
  sentDatetime: string;
}

export class ChatService {
  private connection: signalR.HubConnection | null = null;
  private onMessage?: (message: ChatMessage) => void;
  private senderId: string;

  constructor(senderId: string) {
    this.senderId = senderId;
  }

  onReceiveMessage(callback: (message: ChatMessage) => void) {
    this.onMessage = callback;
  }

  private async ensureConnection() {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://192.168.0.82:5089/chat?senderId=${this.senderId}`)
      .withAutomaticReconnect()
      .build();

    this.connection.on("ReceiveMessage", (message: ChatMessage) => {
      this.onMessage?.(message);
    });

    await this.connection.start();
  }

  async sendMessage(receiverId: string, message: string) {
    await this.ensureConnection();
    await this.connection!.invoke("SendMessage", receiverId, message);
  }

  async getChatHistory(): Promise<Chat[]> {
    await this.ensureConnection();
    return await this.connection!.invoke("GetChatsHistory");
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}
