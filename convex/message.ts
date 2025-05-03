import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const deleteMessageById = mutation({
  args: {
    messageId: v.id("messages"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (args.storageId) {
      await ctx.storage.delete(args.storageId);
    }

    await ctx.db.delete(args.messageId);

    return { success: true, message: "Message deleted successfully" };
  },
});

export const deleteImageById = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.storage.delete(args.storageId);
  },
});

export const getMessageById = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    return message;
  },
});

export const updateMessageStatus = mutation({
  args: {
    messageId: v.id("messages"),
    status: v.union(v.literal("sent"), v.literal("seen")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.messageId, {
      status: args.status,
    });
  },
});

export const markMessagesSeen = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const dateNow = Date.now();

    for (const msg of messages) {
      if (msg.senderId === args.userId) continue;

      const alreadySeen = msg.seenBy?.some(
        (entry) => entry.userId === args.userId
      );
      if (!alreadySeen) {
        await ctx.db.patch(msg._id, {
          status: "seen",
          seenBy: [
            ...(msg.seenBy ?? []),
            {
              userId: args.userId,
              seenAt: dateNow,
            },
          ],
        });
      }
    }
  },
});
