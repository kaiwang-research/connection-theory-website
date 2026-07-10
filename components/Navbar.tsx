import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-200 bg-[#f7f7f5] text-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Connection Theory
        </Link>

        <div className="flex gap-6 text-sm">
          <Link className="hover:text-slate-600" href="/">
            Home
          </Link>
          <Link className="hover:text-slate-600" href="/docs">
            Documentation
          </Link>
          <Link className="hover:text-slate-600" href="/papers">
            Papers
          </Link>
          <Link className="hover:text-slate-600" href="/about">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
