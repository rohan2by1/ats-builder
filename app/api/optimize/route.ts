import { NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not set in environment variables.");
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey:  process.env.DEEPSEEK_API_KEY,
});

/* ── Input limits ─────────────────────────────────────────── */
const MAX_CV_CHARS = 12_000;
const MAX_JD_CHARS =  5_000;
const MAX_SP_CHARS =  4_000;

/* ── Simple in-memory rate limiter ───────────────────────── */
const rateMap = new Map<string, { count: number; ts: number }>();
const RATE_WINDOW_MS = 60_000; // 1 min
const RATE_LIMIT     = 8;      // requests per window

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

/* ── Sanitize helper ──────────────────────────────────────── */
function sanitize(str: string, maxLen: number): string {
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .trim()
    .substring(0, maxLen);
}

/* ── POST handler ─────────────────────────────────────────── */
export async function POST(request: Request) {
  /* Rate limit */
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  /* Parse body */
  let cvText = "", jobDescription = "", systemPrompt = "";
  try {
    const body  = await request.json();
    cvText       = body.cvText       ?? "";
    jobDescription = body.jobDescription ?? "";
    systemPrompt   = body.systemPrompt   ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  /* Validate */
  if (!cvText.trim() || !jobDescription.trim()) {
    return NextResponse.json(
      { error: "Both CV and Job Description are required." },
      { status: 400 }
    );
  }

  /* Sanitize + clamp */
  const cleanCV     = sanitize(cvText,          MAX_CV_CHARS);
  const cleanJD     = sanitize(jobDescription,  MAX_JD_CHARS);
  const cleanPrompt = sanitize(systemPrompt,    MAX_SP_CHARS);

  if (!cleanPrompt) {
    return NextResponse.json(
      { error: "System prompt is missing." },
      { status: 400 }
    );
  }

  /* Call DeepSeek with streaming */
  try {
    const stream = await openai.chat.completions.create({
      model:       "deepseek-chat",
      temperature: 0.7,
      stream:      true,
      messages: [
        { role: "system", content: cleanPrompt },
        {
          role: "user",
          content: `Here is my LaTeX CV:\n${cleanCV}\n\nHere is the Job Description:\n${cleanJD}`,
        },
      ],
    });

    /* Stream the response back */
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });

  } catch (error: unknown) {
    if (error instanceof OpenAI.APIError) {
      console.error(`DeepSeek API Error ${error.status}: ${error.message}`);

      if (error.status === 429) {
        return NextResponse.json(
          { error: "AI rate limit reached. Try again shortly." },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: "API key is invalid or expired." },
          { status: 401 }
        );
      }
      if (error.status === 400) {
        return NextResponse.json(
          { error: "Request rejected by AI. Check prompt length." },
          { status: 400 }
        );
      }
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to optimize CV. Please try again." },
      { status: 500 }
    );
  }
}