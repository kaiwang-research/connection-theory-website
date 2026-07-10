import type { TocSection } from "./toc";

interface LinkContentOptions {
  existingConceptSlugs: string[];
}

function normalizeTitle(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase();
}

function getConceptSlug(href: string): string | null {
  const prefix = "/docs/concepts/";

  if (!href.startsWith(prefix)) {
    return null;
  }

  return href.slice(prefix.length);
}

function buildAvailableLinks(
  sections: TocSection[],
  existingConceptSlugs: string[]
): Map<string, string> {
  const existing = new Set(existingConceptSlugs);
  const links = new Map<string, string>();

  for (const section of sections) {
    for (const item of section.items) {
      const slug = getConceptSlug(item.href);

      if (slug && existing.has(slug)) {
        links.set(normalizeTitle(item.title), item.href);
      }
    }
  }

  return links;
}

function linkPlainListItems(
  listHtml: string,
  hrefByTitle: Map<string, string>
): string {
  return listHtml.replace(
    /<li>([\s\S]*?)<\/li>/g,
    (itemMatch, rawContent: string) => {
      if (/<a\s/i.test(rawContent)) {
        return itemMatch;
      }

      const title = rawContent.replace(/<[^>]+>/g, "").trim();
      const href = hrefByTitle.get(normalizeTitle(title));

      if (!href) {
        return itemMatch;
      }

      return `<li><a href="${href}">${title}</a></li>`;
    }
  );
}

function linkListAfterHeading(
  html: string,
  headingText: string,
  hrefByTitle: Map<string, string>
): string {
  const escapedHeading = headingText.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const pattern = new RegExp(
    `(<h2>${escapedHeading}<\\/h2>[\\s\\S]*?)(<(?:ul|ol)>)([\\s\\S]*?)(<\\/(?:ul|ol)>)`,
    "i"
  );

  return html.replace(
    pattern,
    (
      _match,
      beforeList: string,
      openingList: string,
      listHtml: string,
      closingList: string
    ) =>
      `${beforeList}${openingList}${linkPlainListItems(
        listHtml,
        hrefByTitle
      )}${closingList}`
  );
}

export function addExistingConceptLinks(
  html: string,
  sections: TocSection[],
  options: LinkContentOptions
): string {
  const hrefByTitle = buildAvailableLinks(
    sections,
    options.existingConceptSlugs
  );

  let result = linkListAfterHeading(
    html,
    "Related Concepts",
    hrefByTitle
  );

  result = linkListAfterHeading(
    result,
    "Explore the Foundations",
    hrefByTitle
  );

  return result;
}
