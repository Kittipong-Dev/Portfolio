import { LinkedInClient } from "./LinkedInClient";
import { getCareerProfile } from "@/lib/content";

export const metadata = {
  title: "LinkedIn Helper | CareerOps Portfolio"
};

export default function LinkedInPage() {
  const profile = getCareerProfile();

  return <LinkedInClient personalInfo={profile.personalInfo} items={profile.allItems} />;
}
