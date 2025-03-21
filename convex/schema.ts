import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    image: v.string(),
    tokenIdentifier: v.string(),
    isOnline: v.boolean(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  conversations: defineTable({
    participantName: v.optional(v.string()),
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
    admin: v.optional(v.id("users")),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    sender: v.string(),
    senderName: v.string(),
    content: v.string(),
    messageType: v.string(),
  }).index("by_conversationId", ["conversationId"]),
});
