import type { ContentKind, ContentLink, PersonalInfo } from "./content";

export type StudioPayload = {
  action: "content" | "cv-version" | "profile";
  kind?: ContentKind;
  title: string;
  organization?: string;
  role?: string;
  type?: string;
  category?: string;
  tags?: string[];
  technologies?: string[];
  summary: string;
  bullets?: string[];
  links?: ContentLink[];
  images?: string[];
  certificateImages?: string[];
  mediaFiles?: UploadedMediaFile[];
  body?: string;
  company?: string;
  targetRole?: string;
  cvData?: unknown;
  profile?: PersonalInfo;
};

export type GeneratedFile = {
  path: string;
  content: string;
  encoding?: "utf8" | "base64";
};

export type UploadedMediaFile = {
  fileName: string;
  mimeType: string;
  base64: string;
};

const allowedKinds: ContentKind[] = [
  "experience",
  "project",
  "competition",
  "certificate",
  "education"
];
const allowedMediaTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf"
]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxMediaBytes = 3 * 1024 * 1024;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function sanitizeMediaPath(path: string) {
  if (!path.startsWith("/media/") && !path.startsWith("/images/")) {
    throw new Error("Media paths must start with /media/ or /images/.");
  }

  if (path.includes("..") || /[<>:"|?*]/.test(path)) {
    throw new Error("Media path contains unsafe characters.");
  }

  return path;
}

function normalizeStringList(value: unknown, field: string) {
  if (value === undefined) return [];

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be a string array.`);
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function normalizeLinks(value: unknown) {
  if (value === undefined) return [];

  if (!Array.isArray(value)) {
    throw new Error("links must be an array.");
  }

  return value.map((link) => {
    if (
      !link ||
      typeof link !== "object" ||
      Array.isArray(link) ||
      typeof (link as ContentLink).label !== "string" ||
      typeof (link as ContentLink).url !== "string"
    ) {
      throw new Error("Each link must have label and url.");
    }

    return {
      label: (link as ContentLink).label.trim(),
      url: (link as ContentLink).url.trim()
    };
  });
}

function normalizeMediaFiles(value: unknown) {
  if (value === undefined) return [];

  if (!Array.isArray(value)) {
    throw new Error("mediaFiles must be an array.");
  }

  return value.map((file) => {
    if (
      !file ||
      typeof file !== "object" ||
      Array.isArray(file) ||
      typeof (file as UploadedMediaFile).fileName !== "string" ||
      typeof (file as UploadedMediaFile).mimeType !== "string" ||
      typeof (file as UploadedMediaFile).base64 !== "string"
    ) {
      throw new Error("Each media file must include fileName, mimeType, and base64.");
    }

    const mediaFile = file as UploadedMediaFile;
    const byteSize = Buffer.from(mediaFile.base64, "base64").byteLength;

    if (!allowedMediaTypes.has(mediaFile.mimeType)) {
      throw new Error(`Unsupported upload type: ${mediaFile.mimeType}.`);
    }

    if (byteSize > maxMediaBytes) {
      throw new Error(`${mediaFile.fileName} is too large. Max file size is 3 MB.`);
    }

    return {
      fileName: slugify(mediaFile.fileName.replace(/\.[^.]+$/, "")),
      mimeType: mediaFile.mimeType,
      base64: mediaFile.base64
    };
  });
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function optionalProfileString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function yamlScalar(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeProfile(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("profile must be an object.");
  }

  const record = value as Record<string, unknown>;

  return {
    name: requiredString(record.name, "profile.name"),
    displayName: requiredString(record.displayName, "profile.displayName"),
    title: requiredString(record.title, "profile.title"),
    school: requiredString(record.school, "profile.school"),
    location: requiredString(record.location, "profile.location"),
    email: requiredString(record.email, "profile.email"),
    phone: optionalProfileString(record.phone),
    github: requiredString(record.github, "profile.github"),
    linkedIn: optionalProfileString(record.linkedIn),
    huggingFace: optionalProfileString(record.huggingFace),
    discord: requiredString(record.discord, "profile.discord"),
    instagram: requiredString(record.instagram, "profile.instagram"),
    profileImage: requiredString(record.profileImage, "profile.profileImage"),
    tagline: requiredString(record.tagline, "profile.tagline"),
    hero: requiredString(record.hero, "profile.hero"),
    about: requiredString(record.about, "profile.about")
  };
}

export function validateStudioPayload(payload: unknown): StudioPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Payload must be an object.");
  }

  const record = payload as Record<string, unknown>;
  const action =
    record.action === "cv-version" ? "cv-version" : record.action === "profile" ? "profile" : "content";
  const kind = record.kind as ContentKind | undefined;

  if (action === "content" && (!kind || !allowedKinds.includes(kind))) {
    throw new Error("A valid content kind is required.");
  }

  if (action === "profile") {
    const mediaFiles = normalizeMediaFiles(record.mediaFiles);

    if (mediaFiles.length > 1) {
      throw new Error("Profile updates support one uploaded image at a time.");
    }

    if (mediaFiles.some((file) => !allowedImageTypes.has(file.mimeType))) {
      throw new Error("Profile image must be JPEG, PNG, WebP, or GIF.");
    }

    const profile = normalizeProfile(record.profile);

    if (mediaFiles.length === 0) {
      sanitizeMediaPath(profile.profileImage);
    }

    return {
      action,
      title: `profile: ${profile.displayName}`,
      summary: "Update portfolio profile content.",
      mediaFiles,
      profile
    };
  }

  const images = normalizeStringList(record.images, "images").map(sanitizeMediaPath);
  const certificateImages = normalizeStringList(
    record.certificateImages,
    "certificateImages"
  ).map(sanitizeMediaPath);

  return {
    action,
    kind,
    title: requiredString(record.title, "title"),
    organization:
      typeof record.organization === "string" ? record.organization.trim() : undefined,
    role: typeof record.role === "string" ? record.role.trim() : undefined,
    type: typeof record.type === "string" ? record.type.trim() : undefined,
    category: typeof record.category === "string" ? record.category.trim() : undefined,
    tags: normalizeStringList(record.tags, "tags"),
    technologies: normalizeStringList(record.technologies, "technologies"),
    summary: requiredString(record.summary, "summary"),
    bullets: normalizeStringList(record.bullets, "bullets"),
    links: normalizeLinks(record.links),
    images,
    certificateImages,
    mediaFiles: normalizeMediaFiles(record.mediaFiles),
    body: typeof record.body === "string" ? record.body.trim() : "",
    company: typeof record.company === "string" ? record.company.trim() : undefined,
    targetRole: typeof record.targetRole === "string" ? record.targetRole.trim() : undefined,
    cvData: record.cvData
  };
}

function yamlList(values: string[]) {
  return values.length === 0 ? "" : values.map((value) => `  - ${value}`).join("\n");
}

function yamlLinks(values: ContentLink[]) {
  return values.length === 0
    ? ""
    : values.map((link) => `  - label: ${link.label}\n    url: ${link.url}`).join("\n");
}

function sectionForKind(kind: ContentKind) {
  if (kind === "certificate") return "certificates";
  if (kind === "competition") return "competitions";
  if (kind === "project") return "projects";
  if (kind === "education") return "education";
  return "experiences";
}

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  if (mimeType === "application/pdf") return "pdf";
  throw new Error("Unsupported media type.");
}

function profileYaml(profile: PersonalInfo) {
  return `name: ${yamlScalar(profile.name)}
displayName: ${yamlScalar(profile.displayName)}
title: ${yamlScalar(profile.title)}
school: ${yamlScalar(profile.school)}
location: ${yamlScalar(profile.location)}
email: ${yamlScalar(profile.email)}
phone: ${yamlScalar(profile.phone ?? "")}
github: ${yamlScalar(profile.github)}
linkedIn: ${yamlScalar(profile.linkedIn ?? "")}
huggingFace: ${yamlScalar(profile.huggingFace ?? "")}
discord: ${yamlScalar(profile.discord)}
instagram: ${yamlScalar(profile.instagram)}
profileImage: ${yamlScalar(profile.profileImage)}
tagline: ${yamlScalar(profile.tagline)}
hero: ${yamlScalar(profile.hero)}
about: ${yamlScalar(profile.about)}
`;
}

export function generateContentFiles(payload: StudioPayload): GeneratedFile[] {
  if (payload.action === "cv-version") {
    const date = new Date().toISOString().slice(0, 10);
    const folderSlug = slugify(
      `${date}-${payload.company ?? "target"}-${payload.targetRole ?? payload.title}`
    );
    return [
      {
        path: `cv/versions/${folderSlug}/cv.json`,
        content: `${JSON.stringify(payload.cvData ?? payload, null, 2)}\n`
      },
      {
        path: `cv/versions/${folderSlug}/README.md`,
        content: `# ${payload.title}\n\nEditable CV version generated from the CareerOps CV builder.\n\nExport the PDF from /cv-builder and attach it to this version before merging if needed.\n`
      }
    ];
  }

  if (payload.action === "profile") {
    if (!payload.profile) {
      throw new Error("Profile data is required.");
    }

    const uploadedProfileImage = payload.mediaFiles?.[0];
    const profile = { ...payload.profile };
    const files: GeneratedFile[] = [];

    if (uploadedProfileImage) {
      const extension = extensionForMimeType(uploadedProfileImage.mimeType);
      const fileName = `${slugify(uploadedProfileImage.fileName || profile.displayName)}.${extension}`;
      const profileImagePath = `/media/profile/${fileName}`;
      profile.profileImage = profileImagePath;
      files.push({
        path: `public${profileImagePath}`,
        content: uploadedProfileImage.base64,
        encoding: "base64"
      });
    }

    files.push({
      path: "content/profile.yaml",
      content: profileYaml(profile)
    });

    return files;
  }

  if (!payload.kind) {
    throw new Error("Content kind is required.");
  }

  const slug = slugify(payload.title);
  const section = sectionForKind(payload.kind);
  const uploadedMediaPaths =
    payload.mediaFiles?.map((file) => {
      const extension = extensionForMimeType(file.mimeType);
      return `/media/${section}/${slug}/${file.fileName}.${extension}`;
    }) ?? [];
  const body = payload.body || payload.summary;
  const content = `---
title: ${payload.title}
organization: ${payload.organization ?? ""}
role: ${payload.role ?? ""}
type: ${payload.type ?? payload.kind}
category: ${payload.category ?? payload.kind}
tags:
${yamlList(payload.tags ?? [])}
technologies:
${yamlList(payload.technologies ?? [])}
summary: ${payload.summary}
bullets:
${yamlList(payload.bullets ?? [])}
links:
${yamlLinks(payload.links ?? [])}
images:
${yamlList([...(payload.images ?? []), ...uploadedMediaPaths])}
certificateImages:
${yamlList(payload.certificateImages ?? [])}
priority: 50
visible: true
---

${body}
`;

  return [
    { path: `content/${section}/${slug}.mdx`, content },
    ...(payload.mediaFiles?.map((file, index) => ({
      path: `public${uploadedMediaPaths[index]}`,
      content: file.base64,
      encoding: "base64" as const
    })) ?? [])
  ];
}
