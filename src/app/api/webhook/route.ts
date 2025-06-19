// import type Stripe from "stripe";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/utils/supabase/admin";
// import { stripe } from "@/utils/stripe/stripe";

// // Define your plan limits based on Stripe Price IDs
// // Use null or -1 for unlimited, adjust IDs and limits as needed
// const PLAN_GENERATION_LIMITS: { [key: string]: number | null } = {
//   // Básico Mensual
//   price_1RIDRiHlkYfCqMdp62mQicpj: 20,
//   // Básico Anual
//   price_1RIDSXHlkYfCqMdp1DmHGA5o: 20,
//   // Pro Mensual
//   price_1RIDSfHlkYfCqMdppx88E0yr: 60,
//   // Pro Anual
//   price_1RIDSqHlkYfCqMdpPO3mmasr: 60,
//   // Premium Mensual
//   price_1RIDT5HlkYfCqMdpVutrIwPc: 150,
//   // Premium Anual
//   price_1RIDTBHlkYfCqMdp4CBw3wSl: 150,
// };

// export async function POST(req: NextRequest) {
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Use non-local secret in production
//   const sig = req.headers.get("stripe-signature")!;
//   let event: Stripe.Event;

//   try {
//     const body = await req.text();
//     // Use the correct secret based on environment
//     const secret =
//       process.env.NODE_ENV === "development"
//         ? process.env.STRIPE_WEBHOOK_SECRET_LOCAL!
//         : process.env.STRIPE_WEBHOOK_SECRET!;
//     event = stripe.webhooks.constructEvent(body, sig, secret);
//   } catch (error: any) {
//     console.error("Webhook signature verification failed.", error.message);
//     return NextResponse.json(
//       { error: `Webhook Error: ${error.message}` },
//       { status: 400 },
//     );
//   }

//   // Log the specific event being processed
//   console.log(`Processing event ID: ${event.id}, Type: ${event.type}`);

//   const subscription = event.data.object as Stripe.Subscription;
//   const customerId = subscription.customer as string;

//   const userTableName = "usuarios";
//   const subscriptionTableName = "suscripciones";

//   switch (event.type) {
//     case "customer.subscription.created":
//     case "customer.subscription.updated": {
//       const priceId = subscription.items.data[0]?.price.id;
//       let generationLimit =
//         priceId && PLAN_GENERATION_LIMITS[priceId] !== undefined
//           ? PLAN_GENERATION_LIMITS[priceId]
//           : 0; // Default to 0 if priceId not found

//       // Si está en periodo de prueba, asigna 8 documentos
//       if (subscription.status === "trialing") {
//         generationLimit = 8;
//       }

//       // Add event ID to this log
//       console.log(
//         `[${event.id}] Handling ${event.type} for customer ${customerId}, Price ID: ${priceId}, Status: ${subscription.status}, Setting Generation Limit: ${generationLimit}`,
//       );

//       // 1. Update subscription details in 'suscripciones' table
//       const { error: subError } = await supabaseAdmin
//         .from(subscriptionTableName)
//         .upsert(
//           {
//             subscription_id: subscription.id,
//             stripe_customer_id: customerId,
//             is_subscribed: ["active", "trialing"].includes(subscription.status),
//             status: subscription.status,
//             trial_ends_at: subscription.trial_end
//               ? new Date(subscription.trial_end * 1000).toISOString()
//               : null,
//             current_period_ends_at: subscription.current_period_end
//               ? new Date(subscription.current_period_end * 1000).toISOString()
//               : null,
//             stripe_price_id: priceId,
//           },
//           { onConflict: "stripe_customer_id" },
//         ); // Asegúrate de tener un índice único en stripe_customer_id

//       if (subError) {
//         // Add event ID to error log
//         console.error(
//           `[${event.id}] Error updating subscription table for customer ${customerId}:`,
//           subError,
//         );
//       } else {
//         // Add event ID to success log
//         console.log(
//           `[${event.id}] Successfully updated subscription table for customer ${customerId}`,
//         );
//       }

//       // 2. Find the user_id associated with the customer_id
//       const { data: subscriptionData, error: findUserError } =
//         await supabaseAdmin
//           .from(subscriptionTableName)
//           .select("user_id")
//           .eq("stripe_customer_id", customerId)
//           .order("created_at", { ascending: false }) // Ordena por fecha de creación, más reciente primero
//           .limit(1); // Toma solo el registro más reciente

//       if (findUserError) {
//         // Add event ID to error log
//         console.error(
//           `[${event.id}] Error finding user_id for customer ${customerId}:`,
//           findUserError,
//         );
//       } else if (
//         subscriptionData &&
//         subscriptionData.length > 0 &&
//         subscriptionData[0].user_id
//       ) {
//         const userId = subscriptionData[0].user_id;
//         // Add event ID to log
//         console.log(
//           `[${event.id}] Found user_id ${userId} for customer ${customerId}. Updating ${userTableName}.`,
//         );

//         // 3. Update generation limit in 'usuarios' table using the found user_id
//         if (generationLimit !== undefined) {
//           const { error: userError } = await supabaseAdmin
//             .from(userTableName)
//             .update({
//               generations_remaining: generationLimit,
//             })
//             .eq("user_id", userId); // Cambiado de 'id' a 'user_id' para consistencia

//           if (userError) {
//             // Add event ID to error log
//             console.error(
//               `[${event.id}] Error updating user generation limit for user ${userId} (customer ${customerId}):`,
//               userError,
//             );
//           } else {
//             // Add event ID to success log
//             console.log(
//               `[${event.id}] Successfully updated user generation limit for user ${userId} (customer ${customerId}) to ${generationLimit}`,
//             );
//           }
//         } else {
//           // Add event ID to warning log
//           console.warn(
//             `[${event.id}] Generation limit is undefined for customer ${customerId}, priceId: ${priceId}. User limit not updated.`,
//           );
//         }
//       } else {
//         // Add event ID to warning log
//         console.warn(
//           `[${event.id}] Could not find user_id for customer ${customerId} in ${subscriptionTableName}. Cannot update ${userTableName}.`,
//         );
//       }
//       break;
//     }

//     case "customer.subscription.deleted": {
//       // Add event ID to log
//       console.log(
//         `[${event.id}] Handling ${event.type} for customer ${customerId}`,
//       );

//       // 1. Find the user_id associated with the stripe_customer_id before updating/deleting subscription info
//       const { data: subscriptionDataForDelete, error: findUserErrorForDelete } =
//         await supabaseAdmin
//           .from(subscriptionTableName)
//           .select("user_id")
//           .eq("stripe_customer_id", customerId)
//           .order("created_at", { ascending: false })
//           .limit(1);

//       // 2. Update subscription table
//       const { error: subError } = await supabaseAdmin
//         .from(subscriptionTableName)
//         .update({
//           is_subscribed: false,
//           status: subscription.status, // Keep the final status (e.g., 'canceled')
//           trial_ends_at: null,
//           current_period_ends_at: null,
//           stripe_price_id: null,
//         })
//         .eq("stripe_customer_id", customerId);

//       if (subError) {
//         console.error(
//           `Error updating deleted subscription in subscription table for customer ${customerId}:`,
//           subError,
//         );
//       } else {
//         console.log(
//           `Successfully marked subscription as inactive in subscription table for customer ${customerId}`,
//         );
//       }

//       if (findUserErrorForDelete) {
//         console.error(
//           `Error finding user_id for customer ${customerId} on delete:`,
//           findUserErrorForDelete,
//         );
//       } else if (
//         subscriptionDataForDelete &&
//         subscriptionDataForDelete.length > 0 &&
//         subscriptionDataForDelete[0].user_id
//       ) {
//         const userId = subscriptionDataForDelete[0].user_id;
//         const { error: userError } = await supabaseAdmin
//           .from(userTableName)
//           .update({
//             generations_remaining: 0, // Set to 0 when subscription is deleted/canceled
//           })
//           .eq("user_id", userId); // <--- Aquí estás usando 'user_id' como columna

//         if (userError) {
//           console.error(
//             `Error updating user generation limit to 0 on deletion for user ${userId} (customer ${customerId}):`,
//             userError,
//           );
//         } else {
//           console.log(
//             `Successfully set user generation limit to 0 for user ${userId} (customer ${customerId})`,
//           );
//         }
//       } else {
//         console.warn(
//           `Could not find user_id for customer ${customerId} in ${subscriptionTableName} on delete. Cannot update ${userTableName}.`,
//         );
//       }
//       break;
//     }

//     // Optional: Handle payment failures if needed for your logic
//     // case 'invoice.payment_failed': {
//     //   // Handle failed payment (e.g., notify user, restrict access)
//     //   console.log(`Handling ${event.type} for customer ${customerId}`);
//     //   break;
//     // }

//     case "invoice.payment_succeeded": {
//       // Potentially reset limits here if they are monthly/yearly based on payment,
//       // but the current logic resets on subscription update which might cover it.
//       console.log(
//         `Handling ${event.type} for customer ${customerId} (optional, review if needed)`,
//       );
//       // Example: If you need to reset monthly limits on successful payment:
//       // const invoice = event.data.object as Stripe.Invoice;
//       // const subscriptionId = invoice.subscription as string;
//       // if (subscriptionId) {
//       //   const { data: subDetails } = await stripe.subscriptions.retrieve(subscriptionId);
//       //   const priceId = subDetails?.items.data[0]?.price.id;
//       //   const generationLimit = (priceId && PLAN_GENERATION_LIMITS[priceId] !== undefined)
//       //                             ? PLAN_GENERATION_LIMITS[priceId]
//       //                             : 0;
//       //   // Find user_id via customerId and update generations_remaining as done in subscription.updated
//       // }
//       break;
//     }

//     default:
//       // Add event ID to log
//       console.log(`[${event.id}] Unhandled event type ${event.type}`);
//   }

//   return NextResponse.json({ received: true }, { status: 200 });
// }
