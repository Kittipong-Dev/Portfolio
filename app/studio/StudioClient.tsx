"use client";

import { FilePlus2, GitPullRequest, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ContentKind, PersonalInfo } from "@/lib/content";

type MediaFile = {
  fileName: string;
  mimeType: string;
  base64: string;
};

type StudioClientProps = {
  personalInfo: PersonalInfo;
};

const kinds: ContentKind[] = [
  "experience",
  "project",
  "competition",
  "certificate",
  "education"
];

function splitList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function StudioClient({ personalInfo }: StudioClientProps) {
  const [studioToken, setStudioToken] = useState("");
  const [profile, setProfile] = useState(personalInfo);
  const [profileImageFile, setProfileImageFile] = useState<MediaFile | null>(null);
  const [kind, setKind] = useState<ContentKind>("project");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("AI\nbackend");
  const [technologies, setTechnologies] = useState("TypeScript\nNext.js");
  const [summary, setSummary] = useState("");
  const [bullets, setBullets] = useState("");
  const [links, setLinks] = useState("");
  const [body, setBody] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [status, setStatus] = useState("");
  const profileImagePreview = profileImageFile
    ? `data:${profileImageFile.mimeType};base64,${profileImageFile.base64}`
    : profile.profileImage;

  const parsedLinks = useMemo(
    () =>
      links
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, ...urlParts] = line.split("|");
          return { label: label.trim(), url: urlParts.join("|").trim() };
        })
        .filter((link) => link.label && link.url),
    [links]
  );

  async function onFilesSelected(files: FileList | null) {
    if (!files) return;

    const nextFiles: MediaFile[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 3 * 1024 * 1024) {
        setStatus(`${file.name} is too large. Max size is 3 MB.`);
        continue;
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"].includes(
          file.type
        )
      ) {
        setStatus(`${file.name} has an unsupported file type.`);
        continue;
      }

      nextFiles.push({
        fileName: file.name,
        mimeType: file.type,
        base64: await fileToBase64(file)
      });
    }

    setMediaFiles((current) => [...current, ...nextFiles]);
  }

  async function onProfileImageSelected(files: FileList | null) {
    const file = files?.[0];

    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setStatus(`${file.name} is too large. Max size is 3 MB.`);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setStatus(`${file.name} has an unsupported image type.`);
      return;
    }

    setProfileImageFile({
      fileName: file.name,
      mimeType: file.type,
      base64: await fileToBase64(file)
    });
  }

  function updateProfile(field: keyof PersonalInfo, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function submitProfile() {
    setStatus("Creating profile pull request...");

    const response = await fetch("/api/studio/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-studio-token": studioToken
      },
      body: JSON.stringify({
        action: "profile",
        profile,
        mediaFiles: profileImageFile ? [profileImageFile] : []
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(result.error ?? "Unable to create profile pull request.");
      return;
    }

    setStatus(`Profile pull request created: ${result.pullRequestUrl}`);
  }

  async function submit() {
    setStatus("Creating pull request...");

    const response = await fetch("/api/studio/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-studio-token": studioToken
      },
      body: JSON.stringify({
        action: "content",
        kind,
        title,
        organization,
        role,
        type,
        category,
        tags: splitList(tags),
        technologies: splitList(technologies),
        summary,
        bullets: splitList(bullets),
        links: parsedLinks,
        body,
        mediaFiles
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(result.error ?? "Unable to create pull request.");
      return;
    }

    setStatus(`Pull request created: ${result.pullRequestUrl}`);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/" className="text-sm font-bold text-accent">
              Back to portfolio
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-ink">CareerOps Studio</h1>
            <p className="mt-2 max-w-3xl leading-7 text-muted">
              Create content entries and send them to a server-side API that opens a
              GitHub pull request. The browser never receives a GitHub token.
            </p>
          </div>
          <GitPullRequest className="h-10 w-10 text-accent" aria-hidden="true" />
        </div>

        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-ink">Profile Editor</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Update profile text and upload a new profile image. The server writes
                `content/profile.yaml` and opens a GitHub PR.
              </p>
            </div>
            <div
              className="h-24 w-20 rounded-md border border-slate-200 bg-cover bg-center"
              style={{ backgroundImage: `url("${profileImagePreview}")` }}
              aria-label="Profile image preview"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">Studio password</span>
              <input
                type="password"
                value={studioToken}
                onChange={(event) => setStudioToken(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            {[
              ["displayName", "Display name"],
              ["title", "Title"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["github", "GitHub username"],
              ["linkedIn", "LinkedIn"],
              ["huggingFace", "Hugging Face"],
              ["discord", "Discord"],
              ["instagram", "Instagram"],
              ["location", "Location"]
            ].map(([field, label]) => (
              <label key={field} className="block">
                <span className="text-sm font-bold text-ink">{label}</span>
                <input
                  value={String(profile[field as keyof PersonalInfo] ?? "")}
                  onChange={(event) =>
                    updateProfile(field as keyof PersonalInfo, event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            ))}
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">School</span>
              <input
                value={profile.school}
                onChange={(event) => updateProfile("school", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">Profile image path</span>
              <input
                value={profile.profileImage}
                onChange={(event) => updateProfile("profileImage", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                Uploading a new image will replace this with `/media/profile/...` in the PR.
              </span>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">Tagline</span>
              <textarea
                value={profile.tagline}
                onChange={(event) => updateProfile("tagline", event.target.value)}
                className="mt-2 h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">Hero</span>
              <textarea
                value={profile.hero}
                onChange={(event) => updateProfile("hero", event.target.value)}
                className="mt-2 h-28 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-bold text-ink">About / CV introduction</span>
              <textarea
                value={profile.about}
                onChange={(event) => updateProfile("about", event.target.value)}
                className="mt-2 h-32 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-slate-300 p-4 text-sm font-bold text-ink md:col-span-2">
              <ImagePlus className="h-5 w-5 text-accent" />
              Upload new profile image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => onProfileImageSelected(event.target.files)}
                className="sr-only"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={submitProfile}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white"
          >
            <FilePlus2 className="h-4 w-4" />
            Create Profile Pull Request
          </button>
          {status ? <p className="mt-3 text-sm font-semibold text-muted">{status}</p> : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-ink">Studio password</span>
                <input
                  type="password"
                  value={studioToken}
                  onChange={(event) => setStudioToken(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Content type</span>
                <select
                  value={kind}
                  onChange={(event) => setKind(event.target.value as ContentKind)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  {kinds.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Organization</span>
                <input
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Role</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Type</span>
                <input
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Category</span>
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Tags, one per line</span>
                <textarea
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="mt-2 h-28 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">Technologies, one per line</span>
                <textarea
                  value={technologies}
                  onChange={(event) => setTechnologies(event.target.value)}
                  className="mt-2 h-28 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-ink">Summary</span>
                <textarea
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  className="mt-2 h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-ink">Bullets, one per line</span>
                <textarea
                  value={bullets}
                  onChange={(event) => setBullets(event.target.value)}
                  className="mt-2 h-32 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-ink">Links, label|url per line</span>
                <textarea
                  value={links}
                  onChange={(event) => setLinks(event.target.value)}
                  className="mt-2 h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-ink">Body / notes</span>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="mt-2 h-40 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-slate-300 p-4 text-sm font-bold text-ink md:col-span-2">
                <ImagePlus className="h-5 w-5 text-accent" />
                Upload images, certificates, or PDFs
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={(event) => onFilesSelected(event.target.files)}
                  className="sr-only"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={submit}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white"
            >
              <FilePlus2 className="h-4 w-4" />
              Create Pull Request
            </button>
            {status ? <p className="mt-3 text-sm font-semibold text-muted">{status}</p> : null}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-lg font-extrabold text-ink">Preview</h2>
            <article className="mt-4 rounded-lg border border-slate-200 p-5">
              <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">
                  {kind}
                </span>
                {type ? (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                    {type}
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-ink">{title || "Untitled entry"}</h3>
              <p className="mt-1 text-sm font-semibold text-accent">
                {[role, organization].filter(Boolean).join(" at ")}
              </p>
              <p className="mt-4 leading-7 text-muted">{summary || "Summary preview..."}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                {splitList(bullets).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {mediaFiles.length > 0 ? (
                <p className="mt-4 text-sm font-semibold text-muted">
                  Uploads queued: {mediaFiles.map((file) => file.fileName).join(", ")}
                </p>
              ) : null}
            </article>
            <div className="mt-5 rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <pre className="whitespace-pre-wrap">{`content/${kind}s/${title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-") || "new-entry"}.mdx`}</pre>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
