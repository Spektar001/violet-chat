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
    groupOwner: v.optional(v.id("users")),
    admins: v.optional(v.array(v.id("users"))),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    imageSize: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      })
    ),
    senderId: v.id("users"),
    senderName: v.string(),
    content: v.string(),
    messageType: v.string(),
    status: v.union(v.literal("sending"), v.literal("sent"), v.literal("seen")),
    seenBy: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          seenAt: v.number(),
        })
      )
    ),
  }).index("by_conversationId", ["conversationId"]),
});
