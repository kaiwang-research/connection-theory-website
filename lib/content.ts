import {
  listLocalMarkdownSlugs,
  readLocalMarkdown,
  readLocalText,
  type MarkdownDocument,
} from "./providers/local";

import {
  listGithubMarkdownSlugs,
  readGithubMarkdown,
  readGithubText,
} from "./providers/github";

export type { MarkdownDocument };

function useGithubProvider(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.CONNECTION_THEORY_CONTENT_PROVIDER === "github"
  );
}

export async function readMarkdown(
  folder: string,
  file: string
): Promise<MarkdownDocument> {
  return useGithubProvider()
    ? readGithubMarkdown(folder, file)
    : readLocalMarkdown(folder, file);
}

export async function readText(
  ...segments: string[]
): Promise<string> {
  return useGithubProvider()
    ? readGithubText(...segments)
    : readLocalText(...segments);
}

export async function listMarkdownSlugs(
  folder: string
): Promise<string[]> {
  return useGithubProvider()
    ? listGithubMarkdownSlugs(folder)
    : listLocalMarkdownSlugs(folder);
}
