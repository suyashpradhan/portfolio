// POST /api/ask: streams an answer about Suyash as plain text.
// Runs on demand as a Vercel function; every other page stays static.

import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "../../data/ask";

export const prerender = false;

const MODEL = import.meta.env.ASK_MODEL || process.env.ASK_MODEL || "claude-opus-5-5";
const MAX_TURNS = 10; // messages kept from the conversation
const MAX_CHARS = 600; // per visitor message
const LIMIT = 20; // questions per visitor...
const WINDOW_MS = 10 * 60_000; // ...per 10 minutes (best effort, per warm instance)

const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

function clean(input: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === "user" ? MAX_CHARS : 2000) }));
  // The API needs the conversation to start with the visitor and end with their question.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Only this site may call the endpoint, so it can't be used as a free proxy.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return text("Forbidden", 403);

  const key = process.env.ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY;
  if (!key) return text("The chat isn't switched on yet.", 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || "anon";
  if (rateLimited(ip)) return text("That's a lot of questions! Try again in a few minutes, or just email me.", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return text("Bad request", 400);
  }
  const messages = clean((body as { messages?: unknown })?.messages);
  if (!messages) return text("Bad request", 400);

  const client = new Anthropic({ apiKey: key, maxRetries: 1, timeout: 45_000 });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (s: string) => controller.enqueue(encoder.encode(s));
      try {
        const reply = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 2048, // short answers by design; also caps cost per question
            output_config: { effort: "low" },
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages,
            // If a safety classifier declines, retry on a suitable fallback model in the same call.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal: request.signal },
        );

        for await (const event of reply) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(event.delta.text);
          }
        }
        const final = await reply.finalMessage();
        if (final.stop_reason === "refusal") {
          send("\n\nI can't help with that one. Ask me about Suyash's work instead?");
        }
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          send("I'm getting a lot of questions right now. Try again in a minute.");
        } else if (err instanceof Anthropic.AuthenticationError) {
          console.error("ask: bad ANTHROPIC_API_KEY");
          send("The chat isn't set up correctly yet. Email works, though.");
        } else if (err instanceof Anthropic.APIUserAbortError) {
          // Visitor navigated away; nothing to do.
        } else if (err instanceof Anthropic.APIError) {
          console.error("ask: API error", err.status, err.message);
          send("Something went wrong on my end. Try again, or email me.");
        } else {
          console.error("ask: unexpected error", err);
          send("Something went wrong on my end. Try again, or email me.");
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export const ALL: APIRoute = () => text("Method not allowed", 405);
