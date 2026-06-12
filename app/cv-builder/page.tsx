import { CvBuilderClient } from "./CvBuilderClient";
import { getCareerProfile } from "@/lib/content";

export const metadata = {
  title: "CV Builder | CareerOps Portfolio"
};

export default function CvBuilderPage() {
  const profile = getCareerProfile();

  return (
    <CvBuilderClient
      personalInfo={profile.personalInfo}
      items={profile.allItems}
      skillGroups={profile.skillGroups}
    />
  );
}
