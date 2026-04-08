export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
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
    let endpoint: string;
    let apiKey: string | undefined;
    let model: string;

    switch (provider) {
      case "groq":
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = process.env.GROQ_API_KEY;
        model = clientModel || "llama-3.3-70b-versatile";
        break;
      case "openai":
        endpoint = "https://api.openai.com/v1/chat/completions";
        apiKey = process.env.OPENAI_API_KEY;
        model = clientModel || "gpt-4o-mini";
        break;
      case "gemini":
      default:
        endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
        apiKey = process.env.GEMINI_API_KEY;
        model = clientModel || "gemini-2.0-flash";
        break;
    }

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Missing API key for provider "${provider}".` }),
      };
    }

    // ── Build messages ────────────────────────────────────────────────────
    const defaultSystemPrompt =
      "You are an expert SEO copywriter. Only return the final text without quotes or extra conversation.";

    let payloadMessages = messages;
    if (!payloadMessages) {
      payloadMessages = [
        { role: "system", content: systemPrompt || defaultSystemPrompt },
        { role: "user", content: prompt },
      ];
    }

    // ── Build payload ─────────────────────────────────────────────────────
    const payload: any = {
      model,
      messages: payloadMessages,
    };

    // Token limit parameter differs by provider
    if (provider === "openai") {
      payload.max_completion_tokens = max_completion_tokens;
    } else {
      payload.max_tokens = max_completion_tokens;
    }

    // JSON mode — only for providers that support response_format
    if (isJson && provider !== "gemini") {
      payload.response_format = { type: "json_object" };
    }

    // ── Call provider API ─────────────────────────────────────────────────
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: data.choices[0].message.content,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
