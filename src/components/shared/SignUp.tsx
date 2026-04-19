import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { School, ArrowRight, AlertCircle } from "lucide-react";

interface SignUpProps {
  onSuccess: () => void;
  onNavigateToSignIn: () => void;
}

export default function SignUp({ onSuccess, onNavigateToSignIn }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Save email to session storage to prepopulate sign in form
    sessionStorage.setItem("signup_email", email);
    
    // Explicitly navigate to Sign In page rather than auto-logging in, 
    // especially since we need email confirmation.
    onNavigateToSignIn();
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setError(error.message);
  };

  const pendingProfileStr = sessionStorage.getItem('drona_pending_profile');
  const pendingProfile = pendingProfileStr ? JSON.parse(pendingProfileStr) : null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm flex items-center justify-center">
            <School size={32} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 dark:text-stone-50 font-display tracking-tight">
          Create an Account
        </h2>
        {pendingProfile && (
           <p className="mt-2 text-center text-sm font-semibold text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]">
             Creating profile for {pendingProfile.name} ({pendingProfile.role})
           </p>
        )}
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
          Or{" "}
          <button onClick={onNavigateToSignIn} className="font-bold text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)] hover:underline focus:outline-none">
            sign in to your existing account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-stone-900 py-8 px-4 shadow-xl shadow-stone-200/20 dark:shadow-none sm:rounded-3xl sm:px-10 border border-stone-200 dark:border-stone-800">
          
          {error && (
            <div className="mb-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium text-rose-800 dark:text-rose-200">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-12 flex justify-center items-center gap-3 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl shadow-sm text-sm font-bold text-stone-700 dark:text-stone-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-stone-900 text-stone-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent sm:text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent sm:text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex justify-center items-center gap-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-500)] disabled:opacity-50 transition-all"
              >
                {loading ? "Creating..." : "Create Account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
