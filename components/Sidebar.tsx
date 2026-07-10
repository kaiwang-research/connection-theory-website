import { getDocumentationToc } from "../lib/toc";
import { listLocalMarkdownSlugs } from "../lib/providers/local";
import SidebarNav from "./SidebarNav";

function getSlugFromConceptHref(href: string): string | null {
  const prefix = "/docs/concepts/";

  if (!href.startsWith(prefix)) {
    return null;
  }

  return href.slice(prefix.length);
}

export default async function Sidebar() {
  const [toc, existingConceptSlugs] = await Promise.all([
    getDocumentationToc(),
    listLocalMarkdownSlugs("foundations"),
  ]);

  const existingConcepts = new Set(existingConceptSlugs);

  const visibleSections = toc.sections
    .map((section) => {
      if (section.title !== "Concepts") {
        return section;
      }

      return {
        ...section,
        items: section.items.filter((item) => {
          const slug = getSlugFromConceptHref(item.href);

          return slug ? existingConcepts.has(slug) : true;
        }),
      };
    })
    .filter((section) => section.items.length > 0);

  return (
    <aside className="h-full w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-[#f1f3f5] text-slate-900">
      <div className="px-5 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold">
            Documentation
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Canonical definitions and papers
          </p>
        </div>

        <SidebarNav sections={visibleSections} />
      </div>
    </aside>
  );
}
