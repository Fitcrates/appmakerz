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
      provider = "openai",
      model: clientModel,
      temperature,
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
        model = clientModel || "gpt-4.1";
        break;
      default:
        return new Response(
          JSON.stringify({
            error: `Unsupported provider \"${provider}\". Available providers: openai, groq.`,
          }),
          { status: 400, headers }
        );
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
    const defaultSystemPrompt = "You are a senior bilingual SEO copywriter and editor. Follow the user's instructions exactly. Use references only as background context, never as text to copy. Return only the requested content.";

    let payloadMessages = messages;
    if (!payloadMessages) {
      payloadMessages = [
        { role: "system", content: systemPrompt || defaultSystemPrompt },
        { role: "user", content: prompt || "Hello" },
      ];
    } else if (!payloadMessages.some((message) => message.role === "system")) {
      payloadMessages = [
        { role: "system", content: systemPrompt || defaultSystemPrompt },
        ...payloadMessages,
      ];
    }

    // ── Build payload ─────────────────────────────────────────────────────
    const payload = {
      model,
      messages: payloadMessages,
    };

    if (provider === "openai") {
      payload.max_completion_tokens = max_completion_tokens;
    } else {
      payload.max_tokens = max_completion_tokens;
    }

    if (typeof temperature === "number") {
      payload.temperature = temperature;
    }

    if (isJson) {
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

    const content = choices[0].message.content;
    const normalizedText = Array.isArray(content)
      ? content.map((item) => item?.text || "").join("")
      : content || "";

    return new Response(
      JSON.stringify({ text: normalizedText }),
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
