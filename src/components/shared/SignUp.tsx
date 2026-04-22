import { useState, FormEvent } from "react";
import { supabase } from "../../supabaseClient";
import { GraduationCap, ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface SignUpProps {
  onSuccess: () => void;
  onNavigateToSignIn: () => void;
  onBackToOnboarding: () => void;
}

export default function SignUp({ onSuccess, onNavigateToSignIn, onBackToOnboarding }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: FormEvent) => {
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans premium-texture relative overflow-hidden">
      
      {/* Structural "Blueprint" Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '100px 100px' }} 
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl shadow-sm flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-brand-500/5 animate-pulse rounded-full blur-xl" />
            <GraduationCap size={40} weight="duotone" className="text-brand-600 dark:text-brand-400 relative z-10 transition-transform duration-700 group-hover:rotate-12" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-stone-900 dark:text-stone-50 font-display tracking-tighter uppercase italic leading-none">
          Create account
        </h2>
        {pendingProfile && (
           <p className="mt-4 text-center text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest italic group bg-brand-500/5 py-2.5 px-6 rounded-full mx-auto w-fit border border-brand-500/10">
             Setting up your profile: {pendingProfile.name}
           </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl py-12 px-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] sm:rounded-[40px] border border-stone-100 dark:border-stone-800">
          
          {error && (
            <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 flex items-start gap-4">
              <WarningCircle className="text-rose-500 mt-0.5 shrink-0" size={20} weight="fill" />
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200 leading-relaxed font-sans">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-10">
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-14 flex justify-center items-center gap-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-stone-700 dark:text-stone-200 transition-all focus:outline-none ring-offset-2 ring-brand-500 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest">
                <span className="px-4 bg-white dark:bg-stone-900 text-stone-400">Or sign up with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSignUp}>
            <div className="space-y-3">
              <label htmlFor="email" className="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-6 py-5 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm placeholder-stone-300 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 sm:text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-all font-bold font-sans"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-6 py-5 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm placeholder-stone-300 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 sm:text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-all font-bold font-sans"
              />
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-14 flex justify-center items-center gap-3 border border-transparent rounded-[20px] shadow-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-stone-900 hover:bg-black dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "Creating your account..." : "Create account"}
                {!loading && <ArrowRight size={18} weight="bold" />}
              </motion.button>
            </div>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4 border-t border-stone-50 dark:border-stone-800 pt-8">
             <button type="button" onClick={onNavigateToSignIn} className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest hover:brightness-110 transition-all bg-transparent border-none cursor-pointer p-2">
              Already have an account? Sign in
            </button>
            <button type="button" onClick={onBackToOnboarding} className="text-[9px] font-black text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors uppercase tracking-widest bg-transparent border-none cursor-pointer">
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
