import { getCareerProfile } from "@/lib/content";
import type {
  CareerItem,
  ContentLink,
  LinkItem,
  PersonalInfo
} from "@/lib/content";

export type { LinkItem, PersonalInfo };

export type Hackathon = {
  name: string;
  result: string;
  role: string;
  description: string;
  categories: string[];
};

export type Project = {
  name: string;
  type: string;
  role: string;
  description: string;
  techStack: string[];
  contribution: string;
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
  categories: string[];
};

export type Award = {
  name: string;
  result: string;
  description: string;
  categories?: string[];
};

export type AcademicExperience = {
  name: string;
  result?: string;
  date?: string;
  description: string;
  categories?: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  description: string;
  categories?: string[];
};

const profile = getCareerProfile();

function findLink(links: ContentLink[], labels: string[]) {
  return links.find((link) => labels.includes(link.label.toLowerCase()))?.url;
}

function projectFromItem(item: CareerItem): Project {
  return {
    name: item.title,
    type: item.type ?? item.category ?? "Project",
    role: item.role ?? "Builder",
    description: item.body || item.summary,
    techStack: item.technologies,
    contribution: item.bullets.join(" "),
    image: item.images[0],
    liveUrl: findLink(item.links, ["demo", "live demo", "website"]),
    sourceUrl: findLink(item.links, ["github", "source"]),
    categories: [...item.tags, ...item.technologies]
  };
}

function hackathonFromItem(item: CareerItem): Hackathon {
  return {
    name: item.title,
    result: item.summary,
    role: item.role ?? item.organization ?? "Participant",
    description: item.body || item.bullets.join(" "),
    categories: [...item.tags, ...item.technologies]
  };
}

function academicFromItem(item: CareerItem): AcademicExperience {
  return {
    name: item.title,
    result: item.summary,
    date:
      item.startDate && item.endDate
        ? `${item.startDate} - ${item.endDate}`
        : item.startDate ?? item.endDate,
    description: item.body || item.bullets.join(" "),
    categories: item.tags
  };
}

export const personalInfo = profile.personalInfo;
export const technicalSkills = profile.technicalSkills;
export const softSkills = profile.softSkills;
export const projects = profile.projects.map(projectFromItem);
export const hackathons = profile.competitions.map(hackathonFromItem);
export const awards: Award[] = profile.experiences
  .concat(profile.competitions)
  .filter((item) => item.tags.includes("competition") || item.kind === "competition")
  .map((item) => ({
    name: item.title,
    result: item.summary,
    description: item.body || item.bullets.join(" "),
    categories: item.tags
  }));
export const certifications: Certification[] = profile.certificates.map((item) => ({
  name: item.title,
  issuer: item.organization ?? "Certificate",
  description: item.summary,
  categories: item.tags
}));
export const academicExperiences = [
  ...profile.education.map(academicFromItem),
  ...profile.experiences.map(academicFromItem)
];
export const contactLinks: LinkItem[] = profile.contactLinks;
export const navItems: LinkItem[] = profile.navItems;
