"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TocSection } from "../lib/toc";

interface SidebarNavProps {
  sections: TocSection[];
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/docs") {
    return pathname === "/docs";
  }

  return pathname === href;
}

export default function SidebarNav({
  sections,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-8" aria-label="Documentation">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {section.title}
          </h2>

          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={`${section.title}-${item.href}`}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-slate-900 bg-white font-semibold text-slate-950"
                        : "border-transparent text-slate-700 hover:bg-white hover:text-slate-950",
                    ].join(" ")}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
