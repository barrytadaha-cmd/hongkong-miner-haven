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
        systemPrompt = `You are an expert copywriter specializing in cryptocurrency mining equipment. Generate compelling, professional product descriptions for ASIC miners.

Your descriptions should:
- Highlight key performance metrics (hashrate, efficiency, power consumption)
- Emphasize value propositions and benefits
- Use technical accuracy while remaining accessible
- Include relevant use cases
- Be 2-3 paragraphs long
- Sound professional and trustworthy

Product data will be provided. Create engaging copy that helps customers understand why this miner is a good investment.`;
        break;

      case 'order-inquiry':
        systemPrompt = `You are a helpful customer service assistant for Miner Haolan, a premium ASIC miner retailer. Help customers with order inquiries.

Guidelines:
- Be friendly, professional, and concise
- If order information is provided, reference it accurately
- Explain order statuses clearly (pending, confirmed, processing, shipped, delivered, cancelled)
- For shipping questions, mention we ship from Hong Kong worldwide
- For payment questions, direct them to WhatsApp at +1 407 676 4098
- If you don't have specific order info, ask for order ID or guide them to check their profile

Current order data (if available): ${JSON.stringify(orderData || {})}`;
        break;

      case 'product-recommendation':
        systemPrompt = `You are an expert mining consultant for Miner Haolan. Help customers find the perfect ASIC miner based on their needs.

Consider these factors when making recommendations:
- Budget constraints
- Electricity costs and availability
- Mining goals (Bitcoin, Litecoin, Ethereum Classic, Kaspa, etc.)
- Space and noise requirements (home vs datacenter)
- Cooling preferences (air, hydro, immersion)
- Experience level

Available product categories:
- Bitcoin (SHA256): Antminer S21 series, Whatsminer M60/M50 series, Avalon
- Litecoin/Dogecoin (SCRYPT): Antminer L9/L7, VolcMiner, Elphapex
- Ethereum Classic (EtHash): iPollo, Antminer E9
- Kaspa (KHeavyHash): IceRiver KS series, Bitmain KS series
- Chia (plotting): Various solutions

Product data: ${JSON.stringify(productData || [])}

Provide specific product recommendations with reasoning. Be helpful and educational.`;
        break;

      default:
        systemPrompt = 'You are a helpful AI assistant for Miner Haolan, a premium ASIC miner retailer.';
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
