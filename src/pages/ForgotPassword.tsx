import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword, isLoading, error, resetEmailSent } = useAuth();
  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;
  const COOLDOWN_PERIOD = 30 * 60 * 1000; // 30 minutes
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if in cooldown period
    if (cooldownEnd && Date.now() < cooldownEnd) {
      const minutesLeft = Math.ceil((cooldownEnd - Date.now()) / (60 * 1000));
      alert(`Too many attempts. Please try again in ${minutesLeft} minutes.`);
      return;
    }

    // Check attempt limit
    if (attempts >= MAX_ATTEMPTS) {
      setCooldownEnd(Date.now() + COOLDOWN_PERIOD);
      setAttempts(0);
      alert('Too many attempts. Please try again in 30 minutes.');
      return;
    }

    try {
      await forgotPassword(email);
      setAttempts(prev => prev + 1);
    } catch (err) {
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-info" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">Reset your password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}
        {resetEmailSent && (
          <Alert
            type="success"
            message="If an account exists with this email, you will receive password reset instructions."
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your email"
              disabled={isLoading || resetEmailSent || (cooldownEnd && Date.now() < cooldownEnd)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || resetEmailSent || (cooldownEnd && Date.now() < cooldownEnd)}
          >
            {isLoading ? <LoadingSpinner /> : 'Send reset link'}
          </Button>

          <div className="text-center">
            <Link
              to="/sign-in"
              className="text-sm text-info hover:text-info/90"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}