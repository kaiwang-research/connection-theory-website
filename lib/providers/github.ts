import matter from "gray-matter";
import type { MarkdownDocument } from "./local";

const OWNER =
  process.env.CONNECTION_THEORY_GITHUB_OWNER ??
  "kaiwang-research";

const REPO =
  process.env.CONNECTION_THEORY_GITHUB_REPO ??
  "connection-theory";

const BRANCH =
  process.env.CONNECTION_THEORY_GITHUB_BRANCH ??
  "main";

const TOKEN =
  process.env.CONNECTION_THEORY_GITHUB_TOKEN;

function encodePath(segments: string[]): string {
  return segments
    .flatMap((segment) => segment.split("/"))
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  return headers;
}

async function fetchOrThrow(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    next: { revalidate: 300 },
  });

  if (response.status === 404) {
    const error = new Error(
      `GitHub content not found: ${url}`
    ) as NodeJS.ErrnoException;
    error.code = "ENOENT";
    throw error;
  }

  if (!response.ok) {
    throw new Error(
      `GitHub request failed (${response.status}): ${url}`
    );
  }

  return response;
}

export async function readGithubText(
  ...segments: string[]
): Promise<string> {
  const filePath = encodePath(segments);
  const url =
    `https://raw.githubusercontent.com/` +
    `${OWNER}/${REPO}/${BRANCH}/${filePath}`;

  const response = await fetchOrThrow(url);
  return response.text();
}

export async function readGithubMarkdown(
  folder: string,
  file: string
): Promise<MarkdownDocument> {
  const safeFile = file.replace(/\.md$/i, "");
  const markdown = await readGithubText(
    folder,
    `${safeFile}.md`
  );

  const { content, data } = matter(markdown);

  return { content, data };
}

interface GithubDirectoryEntry {
  name: string;
  type: "file" | "dir" | "symlink" | "submodule";
}

export async function listGithubMarkdownSlugs(
  folder: string
): Promise<string[]> {
  const folderPath = encodePath([folder]);
  const url =
    `https://api.github.com/repos/` +
    `${OWNER}/${REPO}/contents/${folderPath}` +
    `?ref=${encodeURIComponent(BRANCH)}`;

  const response = await fetchOrThrow(url, {
    headers: getHeaders(),
  });

  const entries =
    (await response.json()) as GithubDirectoryEntry[];

  if (!Array.isArray(entries)) {
    throw new Error(
      `Expected a GitHub directory listing for ${folder}.`
    );
  }

  return entries
    .filter(
      (entry) =>
        entry.type === "file" &&
        entry.name.endsWith(".md") &&
        entry.name.toLowerCase() !== "readme.md"
    )
    .map((entry) => entry.name.replace(/\.md$/i, ""))
    .sort();
}
