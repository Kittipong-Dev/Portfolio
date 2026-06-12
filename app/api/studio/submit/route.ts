import { NextRequest, NextResponse } from "next/server";
import { createContentPullRequest } from "@/lib/github";
import { generateContentFiles, validateStudioPayload } from "@/lib/studio";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function assertAuthorized(request: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;

  if (!password) {
    throw new Error("STUDIO_PASSWORD is not configured.");
  }

  if (request.headers.get("x-studio-token") !== password) {
    throw new Error("Unauthorized.");
  }
}

function assertRateLimit(request: NextRequest) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return;
  }

  if (current.count >= 8) {
    throw new Error("Too many requests. Try again in one minute.");
  }

  attempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
}

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request);
    assertAuthorized(request);

    const payload = validateStudioPayload(await request.json());
    const files = generateContentFiles(payload);
    const prefix = payload.action === "cv-version" ? "cv" : "content";
    const title =
      payload.action === "cv-version"
        ? `save cv: ${payload.title}`
        : `add ${payload.kind}: ${payload.title}`;

    const result = await createContentPullRequest({
      title,
      summary: payload.summary,
      files,
      branchPrefix: prefix
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create pull request." },
      { status: error instanceof Error && error.message === "Unauthorized." ? 401 : 400 }
    );
  }
}
