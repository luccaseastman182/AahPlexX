import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Lock } from 'lucide-react';
import { EmailPasswordAuth } from "supertokens-auth-react/recipe/emailpassword";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }

      try {
        // Verify token with SuperTokens
        const response = await EmailPasswordAuth.isPasswordResetTokenValid({
          token,
        });
        setTokenValid(response.status === "OK");
      } catch (err) {
        setTokenValid(false);
        console.error('Token validation error:', err);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!token) {
      setFormError('Invalid reset token');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setFormError(passwordErrors.join('\n'));
      return;
    }

    try {
      await resetPassword(token, formData.password);
      navigate('/sign-in', { 
        state: { message: 'Password reset successful. Please sign in with your new password.' }
      });
    } catch (err) {
      console.error('Reset password error:', err);
    }
  };

  if (validating) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Alert 
          type="error" 
          message="Invalid or expired reset token. Please request a new password reset link." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-info" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">Reset your password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {error && <Alert type="error" message={error} />}
        {formError && <Alert type="error" message={formError} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="mt-1"
                placeholder="Enter new password"
                minLength={8}
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Password must be at least 8 characters long and contain uppercase, lowercase, 
                numbers, and special characters.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="mt-1"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}