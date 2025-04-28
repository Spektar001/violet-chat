import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createConversation = mutation({
  args: {
    participantName: v.optional(v.string()),
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.id("_storage")),
    admins: v.optional(v.array(v.id("users"))),
    groupOwner: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    if (!args.isGroup) {
      const existingConversation = await ctx.db
        .query("conversations")
        .filter((q) =>
          q.and(
            q.eq(q.field("isGroup"), false),
            q.or(
              q.eq(q.field("participants"), args.participants),
              q.eq(q.field("participants"), args.participants.slice().reverse())
            )
          )
        )
        .first();

      if (existingConversation) {
        return existingConversation._id;
      }
    }

    let groupImage;

    if (args.groupImage) {
      groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
    }

    const converstionId = await ctx.db.insert("conversations", {
      participantName: args.participantName,
      participants: args.participants,
      isGroup: args.isGroup,
      groupName: args.groupName,
      groupImage,
      admins: args.admins,
      groupOwner: args.groupOwner,
    });

    return converstionId;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getMyConversations = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
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

    const conversations = await ctx.db.query("conversations").collect();

    const myConversations = conversations.filter((conversation) =>
      conversation.participants.includes(user._id)
    );

    const conversationsWithDetails = await Promise.all(
      myConversations.map(async (conversation) => {
        let userDetails = {};
        if (!conversation.isGroup) {
          const otherUserId = conversation.participants.find(
            (id) => id !== user._id
          );

          const userProfile = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), otherUserId))
            .take(1);

          userDetails = userProfile[0];
        }

        const lastMessage = await ctx.db
          .query("messages")
          .filter((q) => q.eq(q.field("conversationId"), conversation._id))
          .order("desc")
          .take(1);

        return {
          ...userDetails,
          ...conversation,
          lastMessage: lastMessage[0] || null,
        };
      })
    );

    return conversationsWithDetails;
  },
});
