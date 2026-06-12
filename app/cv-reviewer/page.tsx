import { CvReviewerClient } from "./CvReviewerClient";
import { getCareerProfile } from "@/lib/content";

export const metadata = {
  title: "CV Reviewer | CareerOps Portfolio"
};

export default function CvReviewerPage() {
  return <CvReviewerClient profile={getCareerProfile()} />;
}
