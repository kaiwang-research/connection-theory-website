import Link from "next/link";
import DocsLayout from "../../components/DocsLayout";
import { getDocumentationToc } from "../../lib/toc";

export default async function DocsHome() {
  const toc = await getDocumentationToc();

  return (
    <DocsLayout>
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Official Documentation
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Connection Theory Documentation
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-600">
          Canonical definitions, foundational structure, and research
          materials for Connection Theory.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {toc.sections
          .filter((section) => section.title !== "Getting Started")
          .map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold">
                {section.title}
              </h2>

              <ul className="mt-4 space-y-2">
                {section.items.slice(0, 6).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-gray-950 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </DocsLayout>
  );
}
