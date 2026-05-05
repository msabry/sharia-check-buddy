// @ts-nocheck
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const systemPrompt = {
      role: "system",
      content:
        "أنت 'مشير'، مستشار ذكي متخصص في الفقه المالي الإسلامي والمعاملات المالية المعاصرة. تجيب باللغة العربية بأسلوب واضح وموجز ومحترم. تستند إلى المعايير الشرعية لهيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (AAOIFI) عند الاقتضاء. عندما تكون المسألة خلافية، اذكر الآراء المختلفة باختصار. لا تُصدر فتاوى ملزمة، وانصح المستخدم بمراجعة عالم شرعي مختص في المسائل المعقدة.",
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [systemPrompt, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. حاول لاحقاً." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "الرصيد غير كافٍ. يرجى إضافة رصيد." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      throw new Error(`AI gateway error: ${t}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
