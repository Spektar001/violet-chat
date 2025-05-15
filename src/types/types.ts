import { Id } from "../../convex/_generated/dataModel";

export interface IConversation {
  _creationTime: number;
  _id: Id<"conversations">;
  email?: string;
  admins?: Id<"users">[];
  groupOwner?: Id<"users">;
  groupImage?: string;
  image?: string;
  groupName?: string;
  name?: string;
  isGroup: boolean;
  isOnline?: boolean;
  tokenIdentifier?: string;
  otherUser?: {
    _creationTime: number;
    _id: Id<"users">;
    email: string;
    image: string;
    isOnline: boolean;
    name: string;
    tokenIdentifier: string;
  };
  lastMessage?: {
    _creationTime: number;
    _id: Id<"messages">;
    storageId?: Id<"_storage">;
    fileName?: string;
    fileSize?: number;
    imageSize?: { width: number; height: number };
    content: string;
    conversationId: Id<"conversations">;
    status: "sending" | "sent" | "seen";
    seenBy?: { userId: Id<"users">; seenAt: number }[];
    messageType: string;
    senderId: Id<"users">;
    senderName: string;
  };
  participantName?: string;
  participants: Id<"users">[];
}

export interface IUser {
  _id: Id<"users">;
  _creationTime: number;
  name?: string;
  image: string;
  email: string;
  tokenIdentifier: string;
  isOnline: boolean;
}

export interface IMessage {
  _id: Id<"messages">;
  storageId?: Id<"_storage">;
  fileName?: string;
  fileSize?: number;
  imageSize?: { width: number; height: number };
  content: string;
  _creationTime: number;
  messageType: string;
  status: "sending" | "sent" | "seen";
  seenBy?: { userId: Id<"users">; seenAt: number }[];
  sender?: {
    _id: Id<"users">;
    image: string;
    name?: string;
    tokenIdentifier: string;
    email: string;
    _creationTime: number;
    isOnline: boolean;
  };
}
