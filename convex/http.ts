import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const result = await validatePayload(req);

      if (!result) {
        return new Response("Could not validate Clerk payload", {
          status: 400,
        });
      }

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
            email: result.data.email_addresses[0]?.email_address,
            name: `${result.data.first_name ?? "Guest"} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
          });
          break;
        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
            image: result.data.image_url,
          });
          break;
        case "session.created":
          await ctx.runMutation(internal.users.setUserOnline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
          });
          break;
        case "session.removed":
          await ctx.runMutation(internal.users.setUserOffline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (error) {
      console.log("Webhook Error🔥🔥", error);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;