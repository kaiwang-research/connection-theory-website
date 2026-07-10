import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const DEFAULT_CONTENT_ROOT = path.join(
  process.cwd(),
  "..",
  "connection-theory"
);

export const CONTENT_ROOT = path.resolve(
  process.env.CONNECTION_THEORY_CONTENT_ROOT ?? DEFAULT_CONTENT_ROOT
);

export interface MarkdownData {
  title?: string;
  description?: string;
  updated?: string;
  author?: string;
  order?: number;
  status?: string;
}

export interface MarkdownDocument {
  content: string;
  data: MarkdownData;
}

function resolveInsideContentRoot(...segments: string[]): string {
  const resolvedPath = path.resolve(CONTENT_ROOT, ...segments);
  const relativePath = path.relative(CONTENT_ROOT, resolvedPath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      "Requested content path is outside the content repository."
    );
  }

  return resolvedPath;
}

export async function readLocalText(
  ...segments: string[]
): Promise<string> {
  const filePath = resolveInsideContentRoot(...segments);
  return fs.readFile(filePath, "utf8");
}

export async function readLocalMarkdown(
  folder: string,
  file: string
): Promise<MarkdownDocument> {
  const safeFile = file.replace(/\.md$/i, "");
  const filePath = resolveInsideContentRoot(
    folder,
    `${safeFile}.md`
  );

  const markdown = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(markdown);

  return {
    content,
    data: data as MarkdownData,
  };
}

export async function listLocalMarkdownSlugs(
  folder: string
): Promise<string[]> {
  const folderPath = resolveInsideContentRoot(folder);
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name.toLowerCase() !== "readme.md"
    )
    .map((entry) => entry.name.replace(/\.md$/i, ""))
    .sort();
}
