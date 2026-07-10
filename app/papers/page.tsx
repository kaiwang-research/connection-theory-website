import DocsLayout from "../../components/DocsLayout";
import { readMarkdown } from "../../lib/content";
import { renderMarkdown } from "../../lib/markdown";

const fallbackHtml = `
  <h1>Papers</h1>
  <p>
    Research papers and publication materials for Connection Theory
    will be listed here.
  </p>
  <p>
    The paper index is being prepared in the canonical content repository.
  </p>
`;

export default async function PapersPage() {
  let html = fallbackHtml;

  try {
    const { content } = await readMarkdown(
      "papers",
      "README"
    );

    html = await renderMarkdown(content);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }

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
