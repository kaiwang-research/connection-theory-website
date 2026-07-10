import { readLocalMarkdown } from "./providers/local";

export { type MarkdownDocument } from "./providers/local";

export async function readMarkdown(
  folder: string,
  file: string
) {
  return readLocalMarkdown(folder, file);
}