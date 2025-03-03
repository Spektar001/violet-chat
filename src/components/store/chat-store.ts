import { create } from "zustand";
import { Id } from "../../../convex/_generated/dataModel";


export interface IConversation {
  // _id: Id<"conversations">;
  // image?: string;
  // participants: Id<"users">[];
  // isGroup: boolean;
  // name?: string;
  // groupImage?: string;
  // groupName?: string;
  // admin?: Id<"users">;
  // isOnline?: boolean;
  // lastMessage?: {
  //   _id: Id<"messages">;
  //   conversation: Id<"conversations">;
  //   content: string;
  //   sender: Id<"users">;
  //   senderName: string;
  // };
  _creationTime: number;
  _id: Id<"conversations">;
  email?: string;
  admin?: Id<"users">;
  groupImage?: string;
  image?: string;
  groupName?: string;
  name?: string;
  isGroup: boolean;
  isOnline?: boolean;
  tokenIdentifier?: string;
  lastMessage?: {
    _creationTime: number;
    _id: Id<"messages">;
    content: string;
    conversationId: Id<"conversations">;
    messageType: string;
    sender: string;
    senderName: string;
  };
  participants: Id<"users">[];
};

type ConversationStore = {
  selectedConversation: IConversation | null;
  setSelectedConversation: (conversation: IConversation | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
}));

export interface IMessage {
  _id: string;
  content: string;
  _creationTime: number;
  messageType: "text" | "image" | "video";
  sender: {
    _id: Id<"users">;
    image: string;
    name?: string;
    tokenIdentifier: string;
    email: string;
    _creationTime: number;
    isOnline: boolean;
  };
}