// Wrap the entire handler so CORS headers are ALWAYS returned, even on catastrophic crashes
export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Always handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
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
        body: JSON.stringify({ error: `Missing API key for provider "${provider}". Check environment variables.` }),
      };
    }

    // ── Build messages ────────────────────────────────────────────────────
    const defaultSystemPrompt =
      "You are an expert SEO copywriter. Return only the requested content.";

    let payloadMessages = messages;
    if (!payloadMessages) {
      payloadMessages = [
        { role: "system", content: systemPrompt || defaultSystemPrompt },
        { role: "user", content: prompt || "Hello" },
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
    console.log(`[generateContent] Calling ${provider} model=${model} tokens=${max_completion_tokens}`);
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(`[generateContent] Non-JSON response from ${provider}:`, responseText.substring(0, 500));
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: `Provider ${provider} returned non-JSON response: ${responseText.substring(0, 200)}` }),
      };
    }

    // Check for API-level errors
    if (data.error) {
      console.error(`[generateContent] API error from ${provider}:`, JSON.stringify(data.error));
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error.message || JSON.stringify(data.error) }),
      };
    }

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error(`[generateContent] Unexpected response structure from ${provider}:`, JSON.stringify(data).substring(0, 500));
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Unexpected response from ${provider}. No choices returned.` }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: data.choices[0].message.content || "",
      }),
    };

  } catch (error: any) {
    // This catch block ensures CORS headers are returned even on unexpected crashes
    console.error("[generateContent] Unhandled error:", error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unknown server error" }),
    };
  }
};
