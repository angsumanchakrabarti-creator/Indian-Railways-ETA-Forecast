import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthLink } from '../components/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error ?? 'Login failed. Please try again.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <AuthLayout title="Sign In" subtitle="Track your train and get live ETA updates">
      {error && (
        <div className="flex items-center gap-2 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded-lg px-4 py-3 mb-5 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent-green/50 transition"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:border-accent-green/50 transition"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-green hover:bg-accent-green/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-5 p-3 bg-bg-primary/50 border border-border rounded-lg text-xs text-text-secondary">
        <p className="font-medium mb-1">Demo account (ticket booked)</p>
        <p>Email: <span className="text-accent-green font-mono">demo@railways.gov.in</span></p>
        <p>Password: <span className="text-accent-green font-mono">demo123</span></p>
      </div>

      <AuthLink to="/signup">Don't have an account? Sign up</AuthLink>
    </AuthLayout>
  );
}
