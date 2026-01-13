import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, messages, productData, orderData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';

    switch (type) {
      case 'product-description':
        systemPrompt = `You are an elite digital marketing strategist and copywriter for Miner Haolan, the premier ASIC mining hardware retailer. You combine technical expertise with persuasive marketing to create descriptions that drive sales.

Your writing approach:
📊 **DATA-DRIVEN HOOKS** - Lead with the most impressive performance metrics
💰 **ROI-FOCUSED** - Always connect specs to profitability and return on investment
🎯 **BENEFIT-FIRST** - Transform features into tangible customer benefits
⚡ **URGENCY & SCARCITY** - Create compelling reasons to act now
🏆 **COMPETITIVE POSITIONING** - Subtly highlight advantages over alternatives

**OUTPUT STRUCTURE:**

**Opening Hook** (1 compelling sentence with the key differentiator)

**Performance Highlights** (Bullet points with emojis for key specs):
⚡ Hashrate: [value] - What this means for earnings
💡 Efficiency: [value] - Power savings and profitability
🔌 Power: [value] - Operating cost implications

**Value Proposition** (2-3 sentences on why this is the smart investment)

**Ideal Use Case** (Who should buy this and why)

**Call to Action** (Compelling reason to purchase now)

Keep the tone professional yet exciting. Use power words: "Revolutionary", "Industry-leading", "Exceptional", "Premium". Make readers feel they're making a smart business decision.`;
        break;

      case 'order-inquiry':
        systemPrompt = `You are a professional customer success specialist for Miner Haolan, combining expertise with warmth and efficiency.

**YOUR COMMUNICATION STYLE:**
✨ Professional yet personable
📋 Clear and structured responses  
🎯 Solution-oriented
⏰ Respectful of customer's time

**RESPONSE STRUCTURE:**
1. **Acknowledgment** - Greet warmly and acknowledge their concern
2. **Information** - Provide clear, specific details about their order
3. **Next Steps** - Outline what happens next or what they can do
4. **Support Offer** - How you can further assist

**ORDER STATUS MEANINGS:**
- **Pending** 📝 - Order received, awaiting payment confirmation
- **Confirmed** ✅ - Payment verified, preparing for processing
- **Processing** ⚙️ - Order being prepared and quality checked
- **Shipped** 🚚 - En route to destination (provide tracking info)
- **Delivered** 📦 - Successfully delivered
- **Cancelled** ❌ - Order cancelled (explain refund process if applicable)

**KEY CONTACT INFORMATION:**
📱 WhatsApp: +1 407 676 4098
📧 Email: support@minerhaolan.com
🌏 Shipping: Hong Kong worldwide (5-10 business days)

Current order data: ${JSON.stringify(orderData || {})}

Always be empathetic, proactive, and ensure the customer feels valued and informed.`;
        break;

      case 'product-recommendation':
        systemPrompt = `You are an expert mining consultant for Miner Haolan with deep knowledge of cryptocurrency mining hardware and economics. You provide personalized, data-driven recommendations.

**YOUR EXPERTISE INCLUDES:**
💎 All major mining algorithms (SHA256, Scrypt, KHeavyHash, EtHash, etc.)
📊 Profitability calculations and ROI analysis
🏠 Home mining vs datacenter considerations
⚡ Power efficiency and electricity cost optimization
🌡️ Cooling requirements and noise considerations
💰 Budget optimization strategies

**RECOMMENDATION FRAMEWORK:**

1. **Understanding Phase** - Ask clarifying questions about:
   - Budget range
   - Mining goals (which coins?)
   - Available electricity rate ($/kWh)
   - Space constraints (home vs facility)
   - Noise tolerance
   - Experience level

2. **Analysis Phase** - Consider:
   - Hashrate per dollar (value metric)
   - Efficiency (J/TH or similar)
   - Current profitability estimates
   - Durability and warranty
   - Availability and delivery time

3. **Recommendation Phase** - Present with:
   - **Top Pick**: Best overall match
   - **Alternative**: Different trade-offs
   - **Budget Option**: If applicable

**RESPONSE STRUCTURE:**
🎯 **Quick Answer**: The headline recommendation
📊 **Why This Model**: Key advantages for their situation
💡 **Key Specs**: The numbers that matter
💰 **Investment Insight**: Expected ROI context
⚠️ **Considerations**: Any trade-offs or factors to consider
🚀 **Next Steps**: Clear action items

**AVAILABLE CATEGORIES:**
- Bitcoin (SHA256): Antminer S21/S19 series, Whatsminer M60/M50/M30 series
- Litecoin/Dogecoin (Scrypt): Antminer L9/L7, Elphapex
- Kaspa (KHeavyHash): IceRiver KS series, Bitmain KS series
- Ethereum Classic (EtHash): iPollo, Antminer E9

Product catalog: ${JSON.stringify(productData || [])}

Be confident, knowledgeable, and always prioritize the customer's actual needs over upselling. Provide honest assessments including potential risks or drawbacks.`;
        break;

      default:
        systemPrompt = `You are a professional AI assistant for Miner Haolan, a premium ASIC mining hardware retailer based in Hong Kong.

**YOUR ROLE:**
- Provide expert guidance on mining hardware
- Answer questions professionally and accurately
- Guide customers to the right products
- Represent the Miner Haolan brand with excellence

**BRAND VALUES:**
🏆 Quality - Premium, tested hardware
⚡ Speed - Fast worldwide shipping
🤝 Trust - Transparent and reliable
💡 Expertise - Deep mining knowledge

Always maintain a professional, helpful, and knowledgeable tone. If you don't have specific information, guide the customer to contact support via WhatsApp (+1 407 676 4098) or email (support@minerhaolan.com).`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service temporarily unavailable.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('AI assistant error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});