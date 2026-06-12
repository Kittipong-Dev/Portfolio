import type { CareerItem, CareerProfile } from "./content";

export type CvReviewInput = {
  company: string;
  jobTitle: string;
  jobDescription: string;
  companyNotes?: string;
  selectedItemSlugs: string[];
};

export type CvReviewResult = {
  matchScore: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedBulletRewrites: string[];
  skillsToHighlight: string[];
  includeExperiences: string[];
  interviewTopics: string[];
};

const commonWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "you",
  "our",
  "are",
  "that",
  "this",
  "will",
  "from",
  "have",
  "has",
  "your",
  "role",
  "work"
]);

function keywords(text: string) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#. ]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !commonWords.has(word))
    )
  ).slice(0, 40);
}

function itemText(item: CareerItem) {
  return [
    item.title,
    item.organization,
    item.role,
    item.type,
    item.category,
    item.summary,
    item.body,
    ...item.tags,
    ...item.technologies,
    ...item.bullets
  ]
    .filter(Boolean)
    .join(" ");
}

export function reviewCvAgainstJob(
  profile: CareerProfile,
  input: CvReviewInput
): CvReviewResult {
  const jobKeywords = keywords(
    `${input.company} ${input.jobTitle} ${input.jobDescription} ${input.companyNotes ?? ""}`
  );
  const selectedItems = profile.allItems.filter((item) =>
    input.selectedItemSlugs.includes(`${item.kind}:${item.slug}`)
  );
  const cvText = [
    profile.personalInfo.about,
    profile.technicalSkills.join(" "),
    ...selectedItems.map(itemText)
  ].join(" ");
  const normalizedCvText = cvText.toLowerCase();
  const missingKeywords = jobKeywords.filter(
    (keyword) => !normalizedCvText.includes(keyword.toLowerCase())
  );
  const matchedKeywords = jobKeywords.length - missingKeywords.length;
  const matchScore = jobKeywords.length
    ? Math.round((matchedKeywords / jobKeywords.length) * 100)
    : 0;
  const relevantItems = profile.allItems
    .map((item) => ({
      item,
      score: jobKeywords.filter((keyword) => itemText(item).toLowerCase().includes(keyword))
        .length
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    matchScore,
    missingKeywords: missingKeywords.slice(0, 12),
    strengths: relevantItems.slice(0, 3).map((entry) => entry.item.title),
    weaknesses: [
      missingKeywords.length > 0
        ? "The selected CV does not explicitly mention several job keywords."
        : "Keyword coverage is strong, but wording can still be tailored.",
      selectedItems.length < 3
        ? "The CV may need more evidence from projects or competitions."
        : "Keep the strongest items and remove weaker details for one-page targets."
    ],
    suggestedBulletRewrites: selectedItems.slice(0, 3).map((item) => {
      const keyword = jobKeywords.find((word) => itemText(item).toLowerCase().includes(word));
      return keyword
        ? `Rewrite a ${item.title} bullet to foreground ${keyword} while keeping the claim truthful.`
        : `Clarify the measurable outcome or technical responsibility in ${item.title}.`;
    }),
    skillsToHighlight: profile.technicalSkills.filter((skill) =>
      input.jobDescription.toLowerCase().includes(skill.toLowerCase())
    ),
    includeExperiences: relevantItems.slice(0, 5).map((entry) => entry.item.title),
    interviewTopics: missingKeywords.slice(0, 8)
  };
}
