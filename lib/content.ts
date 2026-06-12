import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

export type ContentKind =
  | "experience"
  | "project"
  | "competition"
  | "certificate"
  | "education";

export type LinkItem = {
  label: string;
  value: string;
  href?: string;
};

export type ContentLink = {
  label: string;
  url: string;
};

export type PersonalInfo = {
  name: string;
  displayName: string;
  title: string;
  school: string;
  location: string;
  email: string;
  phone?: string;
  github: string;
  linkedIn?: string;
  huggingFace?: string;
  discord: string;
  instagram: string;
  profileImage: string;
  tagline: string;
  hero: string;
  about: string;
};

export type CareerItem = {
  kind: ContentKind;
  slug: string;
  title: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
  tags: string[];
  technologies: string[];
  summary: string;
  bullets: string[];
  links: ContentLink[];
  images: string[];
  certificateImages: string[];
  priority: number;
  visible: boolean;
  body: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type CareerProfile = {
  personalInfo: PersonalInfo;
  skillGroups: SkillGroup[];
  technicalSkills: string[];
  softSkills: string[];
  experiences: CareerItem[];
  projects: CareerItem[];
  competitions: CareerItem[];
  certificates: CareerItem[];
  education: CareerItem[];
  allItems: CareerItem[];
  contactLinks: LinkItem[];
  navItems: LinkItem[];
};

const contentRoot = join(process.cwd(), "content");

type FrontmatterValue = string | number | boolean | string[] | ContentLink[];

function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);

  return trimmed.replace(/^["']|["']$/g, "");
}

function parseInlineArray(value: string) {
  return value
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseYaml(raw: string) {
  const result: Record<string, FrontmatterValue> = {};
  const lines = raw.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const keyMatch = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);

    if (!keyMatch) {
      index += 1;
      continue;
    }

    const [, key, inlineValue] = keyMatch;

    if (inlineValue) {
      result[key] = inlineValue.startsWith("[")
        ? parseInlineArray(inlineValue)
        : parseScalar(inlineValue);
      index += 1;
      continue;
    }

    const list: unknown[] = [];
    index += 1;

    while (index < lines.length) {
      const listMatch = /^\s*-\s*(.*)$/.exec(lines[index]);
      const nestedMatch = /^\s{4}([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(lines[index]);

      if (!listMatch && !nestedMatch) break;

      if (listMatch) {
        const value = listMatch[1];
        const objectStart = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(value);

        if (objectStart) {
          const objectValue: Record<string, string> = {
            [objectStart[1]]: objectStart[2].replace(/^["']|["']$/g, "")
          };
          index += 1;

          while (index < lines.length) {
            const nextNestedMatch = /^\s{4}([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(
              lines[index]
            );
            if (!nextNestedMatch) break;
            objectValue[nextNestedMatch[1]] = nextNestedMatch[2].replace(/^["']|["']$/g, "");
            index += 1;
          }

          list.push(objectValue);
          continue;
        }

        list.push(value.replace(/^["']|["']$/g, ""));
      }

      index += 1;
    }

    result[key] = list as string[] | ContentLink[];
  }

  return result;
}

function parseMdxFile(filePath: string) {
  const raw = readFileSync(filePath, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw);

  if (!match) {
    throw new Error(`Content validation failed for ${filePath}: missing frontmatter.`);
  }

  return {
    data: parseYaml(match[1]),
    body: match[2].trim()
  };
}

function readYamlFile(filePath: string) {
  return parseYaml(readFileSync(filePath, "utf8"));
}

function requiredString(
  record: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
) {
  const value = record[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Content validation failed for ${filePath}: "${key}" is required.`);
  }

  return value;
}

function optionalString(record: Record<string, FrontmatterValue>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function stringArray(
  record: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
) {
  const value = record[key] ?? [];

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Content validation failed for ${filePath}: "${key}" must be a string list.`);
  }

  return value as string[];
}

function linkArray(record: Record<string, FrontmatterValue>, key: string, filePath: string) {
  const value = record[key] ?? [];

  if (!Array.isArray(value)) {
    throw new Error(`Content validation failed for ${filePath}: "${key}" must be a list.`);
  }

  return value.map((item) => {
    if (
      typeof item !== "object" ||
      !item ||
      Array.isArray(item) ||
      typeof (item as ContentLink).label !== "string" ||
      typeof (item as ContentLink).url !== "string"
    ) {
      throw new Error(
        `Content validation failed for ${filePath}: "${key}" must contain label/url objects.`
      );
    }

    return item as ContentLink;
  });
}

function booleanValue(record: Record<string, FrontmatterValue>, key: string, fallback: boolean) {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(record: Record<string, FrontmatterValue>, key: string, fallback: number) {
  const value = record[key];
  return typeof value === "number" ? value : fallback;
}

function plainTextFromMarkdown(body: string) {
  return body
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/^- /gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function mdxFiles(section: string) {
  const sectionPath = join(contentRoot, section);

  if (!existsSync(sectionPath)) return [];

  return readdirSync(sectionPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => join(sectionPath, entry.name))
    .sort();
}

function readItems(section: string, kind: ContentKind) {
  return mdxFiles(section)
    .map((filePath) => {
      const { data, body } = parseMdxFile(filePath);
      const slug = filePath.split("/").pop()?.replace(/\.mdx$/, "") ?? "";

      return {
        kind,
        slug,
        title: requiredString(data, "title", filePath),
        organization: optionalString(data, "organization"),
        role: optionalString(data, "role"),
        startDate: optionalString(data, "startDate"),
        endDate: optionalString(data, "endDate"),
        type: optionalString(data, "type"),
        category: optionalString(data, "category"),
        tags: stringArray(data, "tags", filePath),
        technologies: stringArray(data, "technologies", filePath),
        summary: requiredString(data, "summary", filePath),
        bullets: stringArray(data, "bullets", filePath),
        links: linkArray(data, "links", filePath),
        images: stringArray(data, "images", filePath),
        certificateImages: stringArray(data, "certificateImages", filePath),
        priority: numberValue(data, "priority", 100),
        visible: booleanValue(data, "visible", true),
        body: plainTextFromMarkdown(body)
      };
    })
    .filter((item) => item.visible)
    .sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));
}

function readProfile() {
  const filePath = join(contentRoot, "profile.yaml");
  const data = readYamlFile(filePath);

  return {
    name: requiredString(data, "name", filePath),
    displayName: requiredString(data, "displayName", filePath),
    title: requiredString(data, "title", filePath),
    school: requiredString(data, "school", filePath),
    location: requiredString(data, "location", filePath),
    email: requiredString(data, "email", filePath),
    phone: optionalString(data, "phone"),
    github: requiredString(data, "github", filePath),
    linkedIn: optionalString(data, "linkedIn"),
    huggingFace: optionalString(data, "huggingFace"),
    discord: requiredString(data, "discord", filePath),
    instagram: requiredString(data, "instagram", filePath),
    profileImage: requiredString(data, "profileImage", filePath),
    tagline: requiredString(data, "tagline", filePath),
    hero: requiredString(data, "hero", filePath),
    about: requiredString(data, "about", filePath)
  };
}

function readSkills() {
  const filePath = join(contentRoot, "skills.yaml");
  const data = readYamlFile(filePath);
  return {
    technical: stringArray(data, "technical", filePath),
    soft: stringArray(data, "soft", filePath)
  };
}

export function getCareerProfile(): CareerProfile {
  const personalInfo = readProfile();
  const skills = readSkills();
  const experiences = readItems("experiences", "experience");
  const projects = readItems("projects", "project");
  const competitions = readItems("competitions", "competition");
  const certificates = readItems("certificates", "certificate");
  const education = readItems("education", "education");
  const allItems = [
    ...experiences,
    ...projects,
    ...competitions,
    ...certificates,
    ...education
  ];

  return {
    personalInfo,
    skillGroups: [
      { name: "Technical Skills", items: skills.technical },
      { name: "Non-Technical Skills", items: skills.soft }
    ],
    technicalSkills: skills.technical,
    softSkills: skills.soft,
    experiences,
    projects,
    competitions,
    certificates,
    education,
    allItems,
    contactLinks: [
      {
        label: "Email",
        value: personalInfo.email,
        href: `mailto:${personalInfo.email}`
      },
      {
        label: "GitHub",
        value: personalInfo.github,
        href: `https://github.com/${personalInfo.github}`
      },
      {
        label: "Discord",
        value: personalInfo.discord
      },
      {
        label: "Instagram",
        value: personalInfo.instagram,
        href: `https://instagram.com/${personalInfo.instagram}`
      }
    ],
    navItems: [
      { label: "About", value: "About", href: "#about" },
      { label: "Skills", value: "Skills", href: "#skills" },
      { label: "Experience", value: "Experience", href: "#experience" },
      { label: "Projects", value: "Projects", href: "#projects" },
      { label: "Competitions", value: "Competitions", href: "#competitions" },
      { label: "Certificates", value: "Certificates", href: "#certificates" },
      { label: "CV Builder", value: "CV Builder", href: "/cv-builder" },
      { label: "CV Reviewer", value: "CV Reviewer", href: "/cv-reviewer" },
      { label: "LinkedIn", value: "LinkedIn", href: "/linkedin" },
      { label: "Studio", value: "Studio", href: "/studio" },
      { label: "Contact", value: "Contact", href: "#contact" }
    ]
  };
}

export function getAllCategories(profile = getCareerProfile()) {
  return Array.from(
    new Set(
      profile.allItems.flatMap((item) => [
        item.kind,
        item.type,
        item.category,
        ...item.tags,
        ...item.technologies
      ])
    )
  )
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b))) as string[];
}
