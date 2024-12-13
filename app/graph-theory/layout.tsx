import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graph Theory Solver',
  description: 'Interactive graph theory problem solver using AI-powered proof generation',
};

export default function GraphTheoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Graph Theory Solver
          </h1>
          <p className="mt-2 text-gray-600">
            Get step-by-step proofs for graph theory problems
          </p>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {children}
      </div>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto py-6 px-4 text-center text-gray-600">
          <p>Email me at damochablog@gmail.com if you've got any feedback!</p>
        </div>
      </footer>
    </div>
  );
}