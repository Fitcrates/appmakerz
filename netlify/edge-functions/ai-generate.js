export default async function(request, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await request.json();
    const {
      prompt,
      systemPrompt,
      messages,
      max_completion_tokens = 4000,
      isJson,
      provider = "gemini",
      model: clientModel,
    } = body;

    // ── Provider routing ──────────────────────────────────────────────────
    let endpoint;
    let apiKey;
    let model;

    switch (provider) {
      case "groq":
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = Deno.env.get("GROQ_API_KEY");
        model = clientModel || "llama-3.3-70b-versatile";
        break;
      case "openai":
        endpoint = "https://api.openai.com/v1/chat/completions";
        apiKey = Deno.env.get("OPENAI_API_KEY");
        model = clientModel || "gpt-4o-mini";
        break;
      case "gemini":
      default:
        endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
        apiKey = Deno.env.get("GEMINI_API_KEY");
        model = clientModel || "gemini-2.0-flash";
        break;
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: `Missing API key for provider "${provider}". Check Netlify environment variables.`,
        }),
        { status: 400, headers }
      );
    }

    // ── Build messages ────────────────────────────────────────────────────
    const defaultSystemPrompt = "You are an expert SEO copywriter. Return only the requested content.";

    let payloadMessages = messages;
    if (!payloadMessages) {
      payloadMessages = [
        { role: "system", content: systemPrompt || defaultSystemPrompt },
        { role: "user", content: prompt || "Hello" },
      ];
    }

    // ── Build payload ─────────────────────────────────────────────────────
    const payload = {
      model,
      messages: payloadMessages,
    };

    payload.max_tokens = max_completion_tokens;

    if (isJson && provider !== "gemini") {
      payload.response_format = { type: "json_object" };
    }

    // ── Call provider API ─────────────────────────────────────────────────
    console.log(`[ai-generate] ${provider} model=${model} tokens=${max_completion_tokens}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(`[ai-generate] Non-JSON from ${provider}:`, responseText.substring(0, 300));
      return new Response(
        JSON.stringify({
          error: `Provider ${provider} returned non-JSON: ${responseText.substring(0, 200)}`,
        }),
        { status: 400, headers }
      );
    }

    if (data.error) {
      const err = data.error;
      console.error(`[ai-generate] API error:`, JSON.stringify(data.error));
      return new Response(
        JSON.stringify({ error: err.message || JSON.stringify(data.error) }),
        { status: 400, headers }
      );
    }

    const choices = data.choices;
    if (!choices || !choices[0] || !choices[0].message) {
      console.error(`[ai-generate] No choices:`, JSON.stringify(data).substring(0, 300));
      return new Response(
        JSON.stringify({
          error: `No choices in response from ${provider}.`,
        }),
        { status: 400, headers }
      );
    }

    return new Response(
      JSON.stringify({ text: choices[0].message.content || "" }),
      { status: 200, headers }
    );
  } catch (error) {
    const message = error.message ? error.message : "Unknown server error";
    console.error("[ai-generate] Unhandled:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers,
    });
  }
}
