import type { TocSection } from "./toc";

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

export function linkRelatedConcepts(
  html: string,
  sections: TocSection[]
): string {
  const conceptSection = sections.find(
    (section) => section.title === "Concepts"
  );

  if (!conceptSection) {
    return html;
  }

  const hrefByTitle = new Map(
    conceptSection.items.map((item) => [
      normalizeTitle(item.title),
      item.href,
    ])
  );

  return html.replace(
    /(<h2>Related Concepts<\/h2>\s*<ul>)([\s\S]*?)(<\/ul>)/i,
    (_match, opening: string, listHtml: string, closing: string) => {
      const linkedList = listHtml.replace(
        /<li>([^<]+)<\/li>/g,
        (itemMatch, rawTitle: string) => {
          const title = rawTitle.trim();
          const href = hrefByTitle.get(normalizeTitle(title));

          if (!href) {
            return itemMatch;
          }

          return `<li><a href="${href}">${title}</a></li>`;
        }
      );

      return `${opening}${linkedList}${closing}`;
    }
  );
}
