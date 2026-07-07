import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold mb-6">
          Connection Theory
        </h1>

        <p className="text-xl max-w-2xl text-gray-600">
          Understanding Persistent Adaptive Systems
        </p>
      </main>
    </>
  );
}