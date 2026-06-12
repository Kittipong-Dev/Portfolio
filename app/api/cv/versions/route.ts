import { NextRequest, NextResponse } from "next/server";
import { generateContentFiles, validateStudioPayload } from "@/lib/studio";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const company = typeof body.company === "string" ? body.company : "target";
    const role = typeof body.role === "string" ? body.role : "role";
    const payload = validateStudioPayload({
      action: "cv-version",
      title: `${company} ${role}`,
      company,
      targetRole: role,
      summary: `CV version for ${company} ${role}`,
      cvData: body
    });
    const [file] = generateContentFiles(payload);

    return NextResponse.json({
      path: file.path,
      message:
        "Editable CV data is prepared. Use /studio to create a GitHub PR for persisted versions."
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare CV version." },
      { status: 400 }
    );
  }
}
