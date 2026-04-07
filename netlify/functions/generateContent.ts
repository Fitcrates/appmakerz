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
    const { prompt, maxTokens = 500, systemPrompt, isJson, messages, tools, tool_choice } = body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing OPENAI_API_KEY environment variable. Add it to .env or Netlify." }) };
    }

    const defaultSystemPrompt = "You are an expert SEO copywriter. Only return the final text without quotes, formatting, or extra conversation.";

    let payloadMessages = messages;
    if (!payloadMessages) {
       payloadMessages = [
          { role: "system", content: systemPrompt || defaultSystemPrompt },
          { role: "user", content: prompt }
       ];
    }

    const payload: any = {
      model: "gpt-4o",
      messages: payloadMessages,
      max_tokens: maxTokens,
    };

    if (isJson) payload.response_format = { type: "json_object" };
    if (tools) payload.tools = tools;
    if (tool_choice) payload.tool_choice = tool_choice;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
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
        message: data.choices[0].message
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
