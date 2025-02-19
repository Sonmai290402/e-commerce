import { createUser } from "@/lib/actions/user.action";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  try {
    const reqHeaders = headers();
    const svix_id = reqHeaders.get("svix-id");
    const svix_timestamp = reqHeaders.get("svix-timestamp");
    const svix_signature = reqHeaders.get("svix-signature");

    if (!process.env.WEBHOOK_SECRET) {
      console.error("WEBHOOK_SECRET is missing");
      return new Response("Server Error", { status: 500 });
    }

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Bad Request - Missing headers", { status: 400 });
    }

    const payload = await req.json();

    const svix = new Webhook(process.env.WEBHOOK_SECRET);
    let msg: WebhookEvent;

    try {
      msg = svix.verify(JSON.stringify(payload), {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Bad Request - Invalid signature", { status: 400 });
    }

    if (msg.type === "user.created") {
      try {
        const user = await createUser({
          username: msg.data.username!,
          name: msg.data.username!,
          clerkId: msg.data.id,
          email: msg.data.email_addresses[0].email_address,
          avatar: msg.data.image_url,
        });

        console.log("✅ User created:", user);
        return NextResponse.json(
          { message: "User created successfully" },
          { status: 201 }
        );
      } catch (err) {
        console.error("❌ Error creating user:", err);
        return new Response("Failed to create user", { status: 500 });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
