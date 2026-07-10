import DocsLayout from "../../components/DocsLayout";
import { readMarkdown } from "../../lib/content";
import { renderMarkdown } from "../../lib/markdown";

export default async function AboutPage() {
  const { content } = await readMarkdown(
    "pages",
    "about"
  );

  const html = await renderMarkdown(content);

  return (
    <DocsLayout>
      <article
        className="markdown"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </DocsLayout>
  );
}
