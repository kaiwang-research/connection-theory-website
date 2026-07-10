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

function getBaseTitle(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
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

function findHrefForTitle(
  rawTitle: string,
  hrefByTitle: Map<string, string>
): string | undefined {
  const exact = hrefByTitle.get(normalizeTitle(rawTitle));

  if (exact) {
    return exact;
  }

  const baseTitle = getBaseTitle(rawTitle);

  return hrefByTitle.get(normalizeTitle(baseTitle));
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

      const visibleTitle = rawContent.replace(/<[^>]+>/g, "").trim();
      const href = findHrefForTitle(
        visibleTitle,
        hrefByTitle
      );

      if (!href) {
        return itemMatch;
      }

      return `<li><a href="${href}">${rawContent}</a></li>`;
    }
  );
}

function linkListsInsideSection(
  sectionHtml: string,
  hrefByTitle: Map<string, string>
): string {
  return sectionHtml.replace(
    /<(ul|ol)>([\s\S]*?)<\/\1>/g,
    (
      _match,
      listType: string,
      listHtml: string
    ) =>
      `<${listType}>${linkPlainListItems(
        listHtml,
        hrefByTitle
      )}</${listType}>`
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

function linkLayerLabels(
  sectionHtml: string,
  hrefByTitle: Map<string, string>
): string {
  return sectionHtml.replace(
    /<strong>(Layer\s+[^<]+?\s+-\s+([^<]+))<\/strong>/gi,
    (
      match,
      fullLabel: string,
      conceptTitle: string
    ) => {
      const href = findHrefForTitle(
        conceptTitle,
        hrefByTitle
      );

      if (!href) {
        return match;
      }

      return `<strong><a href="${href}">${fullLabel}</a></strong>`;
    }
  );
}

function linkDocumentsByLayer(
  html: string,
  hrefByTitle: Map<string, string>
): string {
  return html.replace(
    /(<h2>Documents by Layer<\/h2>)([\s\S]*?)(?=<h2>|$)/i,
    (
      _match,
      heading: string,
      sectionBody: string
    ) => {
      const withLayerLinks = linkLayerLabels(
        sectionBody,
        hrefByTitle
      );

      const withDocumentLinks = linkListsInsideSection(
        withLayerLinks,
        hrefByTitle
      );

      return `${heading}${withDocumentLinks}`;
    }
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

  result = linkDocumentsByLayer(
    result,
    hrefByTitle
  );

  return result;
}
