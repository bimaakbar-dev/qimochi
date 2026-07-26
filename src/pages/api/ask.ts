import type { APIRoute } from "astro";

interface AskRequestBody {
  question: string;
  context: string;
}

interface CloudflareAIResponse {
  result: {
    response: string;
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, context } = (await request.json()) as AskRequestBody;

    if (!question || !context) {
      return new Response(
        JSON.stringify({
          error: "Question and context are required.",
        }),
        { status: 400 },
      );
    }

    const accountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return new Response(
        JSON.stringify({
          answer: "Cloudflare credentials not configured.",
        }),
      );
    }

    const systemPrompt = `You are a helpful assistant for Adogen, an AI-powered Adobe Stock metadata generator. Answer the user's question based on the provided documentation. Be concise and accurate. Do not make up information.

Context:
${context}`;

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-3b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudflare AI Error:", errorData);
      return new Response(
        JSON.stringify({
          answer: "AI request failed",
        }),
      );
    }

    const data = (await res.json()) as CloudflareAIResponse;

    return new Response(
      JSON.stringify({
        answer: data?.result?.response || "No response",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        answer: "Server error",
      }),
    );
  }
};
