import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
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

      return { success: true, message: "Chat deleted successfully" };
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw new ConvexError("Failed to delete chat");
    }
  },
});

export const leaveUser = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    if (!conversation.participants.includes(currentUser._id)) {
      throw new ConvexError("You are not a participant of this conversation.");
    }

    const updatedParticipants = conversation.participants.filter(
      (id) => id !== currentUser._id
    );

    await ctx.db.patch(args.conversationId, {
      participants: updatedParticipants,
    });

    return { success: true };
  },
});

export const updateParticipants = mutation({
  args: {
    conversationId: v.id("conversations"),
    userIds: v.union(v.array(v.id("users")), v.id("users")),
    action: v.union(v.literal("add"), v.literal("remove")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    const userIds = Array.isArray(args.userIds) ? args.userIds : [args.userIds];

    let updatedParticipants = conversation.participants;
    let updatedAdmins = conversation.admins || [];

    if (args.action === "add") {
      const newUsers = userIds.filter(
        (userId) => !updatedParticipants.includes(userId)
      );
      updatedParticipants = [...updatedParticipants, ...newUsers];
    }

    if (args.action === "remove") {
      updatedParticipants = updatedParticipants.filter(
        (id) => !userIds.includes(id)
      );

      updatedAdmins = updatedAdmins.filter(
        (adminId) => !userIds.includes(adminId)
      );
    }

    await ctx.db.patch(args.conversationId, {
      participants: updatedParticipants,
      admins: updatedAdmins,
    });

    return { success: true };
  },
});

export const updateAdmins = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    action: v.union(v.literal("add"), v.literal("remove")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    const currentAdmins = conversation.admins || [];

    let updatedAdmins: Id<"users">[];

    if (args.action === "add") {
      updatedAdmins = currentAdmins.includes(args.userId)
        ? currentAdmins
        : [...currentAdmins, args.userId];
    } else if (args.action === "remove") {
      updatedAdmins = currentAdmins.filter((id) => id !== args.userId);
    } else {
      throw new ConvexError("Invalid action");
    }

    await ctx.db.patch(args.conversationId, {
      admins: updatedAdmins,
    });

    return { success: true };
  },
});

export const updateConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    await ctx.db.patch(args.conversationId, {
      groupName: args.groupName,
    });

    return { success: true };
  },
});
