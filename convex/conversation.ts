import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getConversationById = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new ConvexError("User not found");

    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new ConvexError("Conversation not found");

    if (!conversation.participants.includes(user._id)) {
      throw new ConvexError("You are not part of this conversation");
    }

    const participants = await Promise.all(
      conversation.participants.map(
        async (participantId) => await ctx.db.get(participantId)
      )
    );

    const otherUser =
      (!conversation.isGroup &&
        participants.find((p) => p?._id !== user._id)) ||
      null;

    return {
      ...conversation,
      _id: conversation._id,
      conversationId: conversation._id,
      participantsDetails: participants.filter(Boolean),
      otherUser: !conversation.isGroup ? otherUser : null,
    };
  },
});

export const clearHistory = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    try {
      const conversation = await ctx.db.get(args.conversationId);
      if (!conversation) throw new ConvexError("Conversation not found");

      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
        .collect();

      if (messages.length === 0)
        return { success: true, message: "No messages to delete" };

      await Promise.all(
        messages.map(async (msg) => {
          if (msg.storageId) {
            try {
              await ctx.storage.delete(msg.storageId);
            } catch (err) {
              console.error(`Failed to delete file ${msg.storageId}:`, err);
            }
          }
          await ctx.db.delete(msg._id);
        })
      );

      return { success: true, message: "Chat history cleared" };
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw new ConvexError("Failed to clear chat history");
    }
  },
});

export const deleteChat = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    try {
      const conversation = await ctx.db.get(args.conversationId);
      if (!conversation) throw new ConvexError("Conversation not found");

      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
        .collect();

      await Promise.all(
        messages.map(async (msg) => {
          if (msg.storageId) {
            try {
              await ctx.storage.delete(msg.storageId);
            } catch (err) {
              console.error(`Failed to delete file ${msg.storageId}:`, err);
            }
          }
          await ctx.db.delete(msg._id);
        })
      );

      await ctx.db.delete(args.conversationId);

      return { success: true, message: "Chat deleted successfully", redirectUrl: "/v" };
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw new ConvexError("Failed to delete chat");
    }
  },
});
