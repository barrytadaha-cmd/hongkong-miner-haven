import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  orderId: string;
  status: string;
  trackingNumber: string | null;
}

const statusMessages: Record<string, { subject: string; heading: string; message: string }> = {
  pending: {
    subject: "Order Received",
    heading: "Thank you for your order!",
    message: "We have received your order and are processing it. You will receive updates as your order progresses.",
  },
  confirmed: {
    subject: "Order Confirmed",
    heading: "Your order has been confirmed!",
    message: "Great news! Your order has been confirmed and is being prepared for processing.",
  },
  processing: {
    subject: "Order Processing",
    heading: "Your order is being processed",
    message: "We're currently preparing your order for shipment. You'll receive tracking information once it ships.",
  },
  shipped: {
    subject: "Order Shipped",
    heading: "Your order is on its way!",
    message: "Your order has been shipped and is on its way to you.",
  },
  delivered: {
    subject: "Order Delivered",
    heading: "Your order has been delivered!",
    message: "Your order has been delivered. We hope you enjoy your new mining equipment!",
  },
  cancelled: {
    subject: "Order Cancelled",
    heading: "Your order has been cancelled",
    message: "Your order has been cancelled. If you have any questions, please contact our support team.",
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { orderId, status, trackingNumber }: NotificationRequest = await req.json();

    // Fetch order with user info
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id);

    if (userError || !userData?.user?.email) {
      console.error("User not found:", userError);
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = userData.user.email;
    const statusInfo = statusMessages[status] || statusMessages.pending;

    // Build order items HTML
    const orderItemsHtml = order.order_items
      .map(
        (item: { product_name: string; quantity: number; unit_price: number }) =>
          `<tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product_name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.unit_price * item.quantity).toLocaleString()}</td>
          </tr>`
      )
      .join("");

    // Build tracking section if available
    const trackingHtml = trackingNumber
      ? `
        <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #0284c7;">📦 Tracking Number</p>
          <p style="margin: 8px 0 0 0; font-family: monospace; font-size: 16px;">${trackingNumber}</p>
        </div>
      `
      : "";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${statusInfo.subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #111; margin: 0; font-size: 24px;">${statusInfo.heading}</h1>
            </div>
            
            <p style="color: #666; line-height: 1.6;">${statusInfo.message}</p>
            
            ${trackingHtml}
            
            <div style="margin-top: 24px;">
              <h3 style="color: #111; margin-bottom: 12px;">Order Details</h3>
              <p style="color: #666; margin: 0;">Order ID: <strong>#${orderId.slice(0, 8).toUpperCase()}</strong></p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 16px 12px; text-align: right; font-weight: bold; font-size: 18px;">$${order.total_amount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            
            ${order.shipping_address ? `
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee;">
                <h3 style="color: #111; margin-bottom: 8px;">Shipping Address</h3>
                <p style="color: #666; margin: 0; line-height: 1.6;">
                  ${order.shipping_address}<br>
                  ${[order.shipping_city, order.shipping_postal_code, order.shipping_country].filter(Boolean).join(', ')}
                </p>
              </div>
            ` : ''}
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you have any questions, reply to this email or contact our support team.
              </p>
              <p style="color: #999; font-size: 14px; margin: 8px 0 0 0;">
                Miner Haolan - Premium Mining Equipment
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Miner Haolan <onboarding@resend.dev>",
        to: [userEmail],
        subject: `${statusInfo.subject} - Order #${orderId.slice(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in send-order-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
