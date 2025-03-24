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
