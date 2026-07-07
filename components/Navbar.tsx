export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          Connection Theory
        </h1>

        <div className="flex gap-6 text-sm">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/framework">Framework</a>
          <a href="/foundations">Foundations</a>
          <a href="/frameworks">Frameworks</a>
          <a href="/papers">Papers</a>
        </div>
      </div>
    </nav>
  );
}