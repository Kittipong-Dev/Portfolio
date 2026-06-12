import { StudioClient } from "./StudioClient";
import { getCareerProfile } from "@/lib/content";

export const metadata = {
  title: "Studio | CareerOps Portfolio"
};

export default function StudioPage() {
  const profile = getCareerProfile();

  return <StudioClient personalInfo={profile.personalInfo} />;
}
