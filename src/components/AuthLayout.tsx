import { Train } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-green/20 mb-4">
            <Train className="w-8 h-8 text-accent-green" />
          </div>
          <h1 className="text-2xl font-bold">Indian Railways</h1>
          <p className="text-text-secondary text-sm mt-1">ETA Forecast & Journey Tracker</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-text-secondary text-sm mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-xs text-text-secondary mt-6">
          © 2026 Indian Railways – Ministry of Railways, Govt. of India
        </p>
      </div>
    </div>
  );
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <p className="text-center text-sm text-text-secondary mt-6">
      <Link to={to} className="text-accent-green hover:underline font-medium">
        {children}
      </Link>
    </p>
  );
}
