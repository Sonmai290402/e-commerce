import createUser from "@/lib/actions/user.action";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

type ClerkUserCreatedEvent = {
  id: string;
  username?: string | null;
  email_addresses: { email_address: string }[];
  image_url?: string;
};

export async function POST(req: Request) {
  const svix_id = headers().get("svix-id") ?? "";
  const svix_timestamp = headers().get("svix-timestamp") ?? "";
  const svix_signature = headers().get("svix-signature") ?? "";

  if (!process.env.WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET is not set");
    return new Response("Server Error", { status: 500 });
  }

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing webhook headers");
    return new Response("Bad Request", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const svix = new Webhook(process.env.WEBHOOK_SECRET);
  let msg: WebhookEvent;

  try {
    msg = svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Bad Request", { status: 400 });
  }

  if (msg.type === "user.created") {
    console.log("📩 Processing user.created webhook...");

    setTimeout(async () => {
      try {
        const data = msg.data as ClerkUserCreatedEvent;

        const user = await createUser({
          username: data.username ?? "unknown",
          name: data.username ?? "unknown",
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address ?? "",
          avatar: data.image_url ?? "",
        });

        console.log("✅ User created successfully:", user);
      } catch (error) {
        console.error("❌ Error creating user:", error);
      }
    }, 0);

    return new Response("Webhook received", { status: 200 });
  }

  return new Response("OK", { status: 200 });
}
