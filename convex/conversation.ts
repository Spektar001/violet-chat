import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

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
      (!conversation.isGroup && participants.find((p) => p?._id !== user._id)) ||
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
