export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-4xl font-bold">🔐 Password Vault</h1>
      <p className="text-gray-400 mt-3">Securely store your credentials.</p>
      <a href="/signin" className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">Get Started</a>
    </div>
  );
}
