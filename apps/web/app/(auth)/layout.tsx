import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EOT Intelligence Platform - Authentication',
  description: 'Sign in to your EOT Intelligence Platform account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}