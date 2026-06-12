import { NextRequest, NextResponse } from "next/server";
import { getCareerProfile } from "@/lib/content";
import { reviewCvAgainstJob } from "@/lib/cv-reviewer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body.jobDescription !== "string" || body.jobDescription.length < 20) {
      return NextResponse.json(
        { error: "A job description of at least 20 characters is required." },
        { status: 400 }
      );
    }

    const result = reviewCvAgainstJob(getCareerProfile(), {
      company: typeof body.company === "string" ? body.company : "",
      jobTitle: typeof body.jobTitle === "string" ? body.jobTitle : "",
      jobDescription: body.jobDescription,
      companyNotes: typeof body.companyNotes === "string" ? body.companyNotes : "",
      selectedItemSlugs: Array.isArray(body.selectedItemSlugs)
        ? body.selectedItemSlugs.filter((item: unknown): item is string => typeof item === "string")
        : []
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to review CV." },
      { status: 400 }
    );
  }
}
