import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900">
      <Navbar />

      <div className="flex h-[calc(100vh-65px)] min-w-0">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#fafaf9]">
          <div className="mx-auto w-full max-w-3xl px-8 py-14 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
