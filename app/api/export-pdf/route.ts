import { NextRequest, NextResponse } from "next/server";

const TEXAPI_URL = "https://texapi.ovh/api/latex/compile";
const TEXAPI_FILES_URL = "https://texapi.ovh/api/latex/files";

export async function POST(req: NextRequest) {
  const apiKey = process.env.TEXAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TEXAPI_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { content } = body;
  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'content' field." },
      { status: 400 },
    );
  }

  /* ── Compile LaTeX via Texapi ──────────────────────────────────── */
  try {
    const compileRes = await fetch(TEXAPI_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const contentType = compileRes.headers.get("content-type") || "";

    /* Texapi may return PDF binary directly on success */
    if (contentType.includes("application/pdf")) {
      const pdfBuffer = await compileRes.arrayBuffer();
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="cv_optimized_${Date.now()}.pdf"`,
        },
      });
    }

    /* Otherwise parse JSON (success with resultPath, or error) */
    const compileResult = await compileRes.json();

    if (compileResult.status === "error" || !compileResult.resultPath) {
      const msgs = compileResult.errors?.length
        ? compileResult.errors.join("\n")
        : "Unknown compilation error";
      return NextResponse.json({ error: msgs }, { status: 422 });
    }

    /* Download PDF from resultPath */
    const fileKey = compileResult.resultPath.includes("/")
      ? compileResult.resultPath.split("/").pop()
      : compileResult.resultPath;

    const pdfRes = await fetch(`${TEXAPI_FILES_URL}/${fileKey}`, {
      headers: { "X-API-KEY": apiKey },
    });

    if (!pdfRes.ok) {
      return NextResponse.json(
        { error: `Failed to download PDF: HTTP ${pdfRes.status}` },
        { status: 502 },
      );
    }

    const pdfBuffer = await pdfRes.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cv_optimized_${Date.now()}.pdf"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `Texapi request failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 502 },
    );
  }
}
