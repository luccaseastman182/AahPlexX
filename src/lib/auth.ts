import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signOut, signUp, sendPasswordResetEmail, submitNewPassword } from 'supertokens-web-js/recipe/emailpassword';
import Session from 'supertokens-web-js/recipe/session';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  resetEmailSent: boolean;
  returnTo: string | null;
  accessToken: string | null;
  setReturnTo: (path: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      resetEmailSent: false,
      returnTo: null,
      accessToken: null,

      setReturnTo: (path) => set({ returnTo: path }),

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signIn({
            formFields: [
              { id: "email", value: email },
              { id: "password", value: password }
            ]
          });

          if (response.status === "OK") {
            const session = await Session.getAccessTokenPayloadSecurely();
            set({ 
              user: {
                id: response.user.id,
                email: response.user.email,
                name: response.user.firstName || 'User',
                role: 'user'
              },
              accessToken: session.token,
              error: null
            });
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (err) {
          set({ error: 'Invalid credentials', user: null, accessToken: null });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signUp({
            formFields: [
              { id: "email", value: email },
              { id: "password", value: password },
              { id: "name", value: name }
            ]
          });

          if (response.status === "OK") {
            const session = await Session.getAccessTokenPayloadSecurely();
            set({ 
              user: {
                id: response.user.id,
                email: response.user.email,
                name: name,
                role: 'user'
              },
              accessToken: session.token,
              error: null
            });
          } else {
            throw new Error("Failed to create account");
          }
        } catch (err) {
          set({ error: 'Failed to create account', user: null, accessToken: null });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({ user: null, accessToken: null, error: null });
        } catch (err) {
          set({ error: 'Failed to sign out' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await sendPasswordResetEmail({
            formFields: [{ id: "email", value: email }]
          });
          
          if (response.status === "OK") {
            set({ resetEmailSent: true, error: null });
          } else {
            throw new Error("Failed to send reset email");
          }
        } catch (err) {
          set({ error: 'Failed to send reset email', resetEmailSent: false });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await submitNewPassword({
            formFields: [{ id: "password", value: newPassword }],
            token
          });
          
          if (response.status === "OK") {
            set({ error: null });
          } else {
            throw new Error("Failed to reset password");
          }
        } catch (err) {
          set({ error: 'Failed to reset password' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      refreshSession: async () => {
        try {
          const session = await Session.getAccessTokenPayloadSecurely();
          if (session) {
            const userInfo = await Session.getUserId();
            set({
              user: {
                id: userInfo,
                email: session.email || '',
                name: session.name || 'User',
                role: 'user'
              },
              accessToken: session.token,
              error: null
            });
          }
        } catch (err) {
          console.error('Session refresh error:', err);
          set({ user: null, accessToken: null, error: 'Session expired' });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);