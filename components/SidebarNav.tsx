"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
} from "react";
import type { TocSection } from "../lib/toc";

interface SidebarNavProps {
  sections: TocSection[];
}

const SIDEBAR_SCROLL_KEY =
  "connection-theory:sidebar-scroll-top";

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
  const navRef = useRef<HTMLElement>(null);

  function getScrollContainer(): HTMLElement | null {
    return navRef.current?.closest("aside") ?? null;
  }

  function saveScrollPosition() {
    const container = getScrollContainer();

    if (!container) {
      return;
    }

    sessionStorage.setItem(
      SIDEBAR_SCROLL_KEY,
      String(container.scrollTop)
    );
  }

  useEffect(() => {
    const container = getScrollContainer();

    if (!container) {
      return;
    }

    const savedPosition = sessionStorage.getItem(
      SIDEBAR_SCROLL_KEY
    );

    if (savedPosition === null) {
      return;
    }

    const scrollTop = Number(savedPosition);

    if (!Number.isFinite(scrollTop)) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      container.scrollTop = scrollTop;
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="space-y-8"
      aria-label="Documentation"
    >
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
                    onClick={saveScrollPosition}
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
