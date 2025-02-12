import createUser from "@/lib/actions/user.action";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const svix_id = headers().get("svix-id") ?? "";
  const svix_timestamp = headers().get("svix-timestamp") ?? "";
  const svix_signature = headers().get("svix-signature") ?? "";

  if (!process.env.WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET is not set");
  }
  if (!svix_id || !svix_timestamp || !svix_signature) {
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
    console.error("Verification failed:", err);
    return new Response("Bad Request", { status: 400 });
  }

  if (msg.type === "user.created") {
    const { id, username, email_addresses, image_url } = msg.data;

    try {
      const user = await createUser({
        username: username!,
        name: username!,
        clerkId: id,
        email: email_addresses[0].email_address,
        avatar: image_url,
      });
      return NextResponse.json({ message: "OK", user });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
