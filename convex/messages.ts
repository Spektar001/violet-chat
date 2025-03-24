import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendTextMessages = mutation({
  args: {
    conversationId: v.id("conversations"),
    sender: v.string(),
    senderName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversationId))
      .first();

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }
    if (!conversation.participants.includes(user._id)) {
      throw new ConvexError("You are not part of this conversation");
    }

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      sender: args.sender,
      senderName: args.senderName,
      content: args.content,
      messageType: "text",
    });
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const userProfileCache = new Map();

    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        let sender;
        // Check if sender profile is in cache
        if (userProfileCache.has(message.sender)) {
          sender = userProfileCache.get(message.sender);
        } else {
          // Fetch sender profile from the database
          sender = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), message.sender))
            .first();
          // Cache the sender profile
          userProfileCache.set(message.sender, sender);
        }

        return { ...message, sender };
      })
    );

    return messagesWithSender;
  },
});

export const sendFile = mutation({
  args: {
    storageId: v.id("_storage"),
    sender: v.id("users"),
    senderName: v.string(),
    messageType: v.string(),
    conversationId: v.id("conversations"),
    fileName: v.string(),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const content = (await ctx.storage.getUrl(args.storageId)) as string;

    await ctx.db.insert("messages", {
      content: content,
      sender: args.sender,
      senderName: args.senderName,
      messageType: args.messageType,
      conversationId: args.conversationId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileSize: args.fileSize,
    });
  },
});
