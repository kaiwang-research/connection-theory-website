import { notFound } from "next/navigation";
import DocsLayout from "../../../components/DocsLayout";
import { readMarkdown } from "../../../lib/content";
import { renderMarkdown } from "../../../lib/markdown";
import { listLocalMarkdownSlugs } from "../../../lib/providers/local";
import { getDocumentationToc } from "../../../lib/toc";
import { addExistingConceptLinks } from "../../../lib/contentLinks";

export default async function FoundationsOverviewPage() {
  try {
    const [document, toc, existingConceptSlugs] = await Promise.all([
      readMarkdown("foundations", "README"),
      getDocumentationToc(),
      listLocalMarkdownSlugs("foundations"),
    ]);

    const renderedHtml = await renderMarkdown(
      document.content
    );

    const contentHtml = addExistingConceptLinks(
      renderedHtml,
      toc.sections,
      {
        existingConceptSlugs,
      }
    );

    return (
      <DocsLayout>
        <article
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: contentHtml,
          }}
        />
      </DocsLayout>
    );
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      notFound();
    }

    throw error;
  }
}
