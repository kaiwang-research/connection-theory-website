import { load } from "js-yaml";
import { readText } from "./content";

export interface TocItem {
  title: string;
  href: string;
}

export interface TocSection {
  title: string;
  items: TocItem[];
}

export interface DocumentationToc {
  sections: TocSection[];
}

function isTocItem(value: unknown): value is TocItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.title === "string" &&
    typeof item.href === "string"
  );
}

function isTocSection(value: unknown): value is TocSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return (
    typeof section.title === "string" &&
    Array.isArray(section.items) &&
    section.items.every(isTocItem)
  );
}

export async function getDocumentationToc(): Promise<DocumentationToc> {
  const source = await readText("toc.yml");
  const parsed = load(source);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("toc.yml must contain a YAML object.");
  }

  const document = parsed as Record<string, unknown>;

  if (
    !Array.isArray(document.sections) ||
    !document.sections.every(isTocSection)
  ) {
    throw new Error(
      "toc.yml must contain a valid 'sections' list."
    );
  }

  return { sections: document.sections };
}
