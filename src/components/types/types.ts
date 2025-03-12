import { Id } from "../../../convex/_generated/dataModel";

export interface IConversation {
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
}

export interface IMessage {
  _id: string;
  content: string;
  _creationTime: number;
  messageType: string;
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
