import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: process.env.STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
