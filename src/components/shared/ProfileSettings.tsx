import { 
  useState,
  useRef,
  useEffect,
  ReactNode 
} from "react";
import { 
  User, 
  Bell, 
  Shield, 
  CircleHelp, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  MonitorSmartphone,
  Key,
  Smartphone,
  Laptop,
  Camera,
  AlertCircle
} from "lucide-react";
import { Role } from "../../types";
import { Btn } from "./UI";
import { supabase } from "../../supabaseClient";

type SettingsPage = 'main' | 'personal_info' | 'security' | 'sessions' | 'notifications' | 'privacy' | 'help' | 'terms';

export default function ProfileSettings({ role }: { role: Role }) {
  const [activePage, setActivePage] = useState<SettingsPage>('main');
  const [profile, setProfile] = useState<{name: string, email: string, phone: string, avatarColor: string, initial: string}>({
    name: "Loading...",
    email: "Loading...",
    phone: "Pending Setup",
    initial: "D",
    avatarColor: role === "student" ? "bg-emerald-100 text-emerald-700" : (role === "teacher" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700")
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
      
      const pName = data?.full_name || "Drona User";
      let finalAvatarUrl = null;

      if (data?.avatar_url) {
        const { data: signed } = await supabase.storage.from('app-files').createSignedUrl(data.avatar_url, 3600);
        finalAvatarUrl = signed?.signedUrl;
      }
      
      setProfile({
        name: pName,
        email: user.email || "",
        phone: data?.phone || "Pending Setup",
        initial: pName.charAt(0).toUpperCase(),
        avatar_url: finalAvatarUrl,
        avatarColor: role === "student" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : (role === "teacher" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300")
      });
    }
    load();
  }, [role]);

  // Render Sub-pages
  if (activePage !== 'main') {
    return (
      <div className="flex-1 flex flex-col w-full bg-stone-50 dark:bg-stone-950 animate-slide-in-right overflow-hidden">
        {/* Sub-page Header */}
        <div className="h-16 px-4 flex items-center border-b border-stone-200 dark:border-stone-800 shrink-0 bg-white dark:bg-stone-900 shadow-sm relative z-10 w-full">
          <button 
            onClick={() => setActivePage('main')}
            className="w-11 h-11 flex items-center justify-center -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="font-sans font-bold text-lg text-stone-900 dark:text-stone-50 ml-2">
            {activePage === 'personal_info' && 'Personal Information'}
            {activePage === 'security' && 'Password & Security'}
            {activePage === 'sessions' && 'Active Sessions'}
            {activePage === 'notifications' && 'Notifications'}
            {activePage === 'privacy' && 'Privacy'}
            {activePage === 'help' && 'Help Center'}
            {activePage === 'terms' && 'Terms of Service'}
          </div>
        </div>

        {/* Sub-page Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {activePage === 'personal_info' && <PersonalInfoView details={profile} setDetails={setProfile} />}
          {activePage === 'security' && <PasswordSecurityView />}
          {activePage === 'sessions' && <ActiveSessionsView />}
          {activePage === 'notifications' && <NotificationsView />}
          {activePage === 'privacy' && <PrivacyView />}
          {activePage === 'help' && <HelpCenterView />}
          {activePage === 'terms' && <TermsView />}
        </div>
      </div>
    );
  }

  // Render Main Settings Page
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col w-full animate-fade-in">
      {/* Header */}
      <div className="px-6 py-6 shrink-0">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Profile & Settings</h1>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex items-center gap-4 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
             onClick={() => setActivePage('personal_info')}>
          {profile.avatar_url ? (
             <img src={profile.avatar_url} alt="Profile" className="w-14 h-14 rounded-full object-cover shrink-0 border border-stone-200 dark:border-stone-800" referrerPolicy="no-referrer" />
          ) : (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${profile.avatarColor}`}>
              {profile.initial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans truncate">{profile.name}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-sans truncate">{profile.email}</p>
          </div>
          <button className="w-11 h-11 flex items-center justify-center bg-stone-50 dark:bg-stone-950 rounded-full text-stone-600 dark:text-stone-300 pointer-events-none">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Account Group */}
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Account</div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <SettingsItem icon={<User size={18} />} label="Personal Information" onClick={() => setActivePage('personal_info')} />
            <SettingsItem icon={<Key size={18} />} label="Password & Security" onClick={() => setActivePage('security')} />
            <SettingsItem icon={<MonitorSmartphone size={18} />} label="Active Sessions" onClick={() => setActivePage('sessions')} noBorder />
          </div>
        </div>

        {/* Preferences Group */}
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Preferences</div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <SettingsItem icon={<Bell size={18} />} label="Notifications" onClick={() => setActivePage('notifications')} />
            <SettingsItem icon={<Shield size={18} />} label="Privacy" onClick={() => setActivePage('privacy')} noBorder />
          </div>
        </div>

        {/* Support Group */}
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Support</div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <SettingsItem icon={<CircleHelp size={18} />} label="Help Center" onClick={() => setActivePage('help')} />
            <SettingsItem icon={<Shield size={18} />} label="Terms of Service" onClick={() => setActivePage('terms')} />
            <SettingsItem label="App Version" value="v2.1.1" noBorder />
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={async () => {
             await supabase.auth.signOut();
             window.location.reload();
          }}
          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex items-center justify-center gap-2 text-rose-600 dark:text-rose-500 font-bold font-sans shadow-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors active:scale-[0.98] cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>

      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-views 
// -----------------------------------------------------------------------------

function PersonalInfoView({ details, setDetails }: { details: any, setDetails: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(details.avatar_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase.from('user_profiles').select('avatar_url, cover_url').eq('id', user.id).single();
    if (data?.avatar_url) {
      const { data: signedAvatar } = await supabase.storage.from('app-files').createSignedUrl(data.avatar_url, 3600);
      if (signedAvatar?.signedUrl) setAvatarUrl(signedAvatar.signedUrl);
    }
    if (data?.cover_url) {
      const { data: signedCover } = await supabase.storage.from('app-files').createSignedUrl(data.cover_url, 3600);
      if (signedCover?.signedUrl) setCoverUrl(signedCover.signedUrl);
    }
  };

  const handleUpload = async (file: File, type: 'avatar' | 'cover') => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    type === 'avatar' ? setIsUploadingAvatar(true) : setIsUploadingCover(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: oldProfile } = await supabase.from('user_profiles').select('avatar_url, cover_url').eq('id', user.id).single();
      
      const fileExt = file.name.split('.').pop();
      const folder = type === 'avatar' ? 'avatars' : 'covers';
      const filePath = `${user.id}/${folder}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('app-files').upload(filePath, file);
      if (uploadError) throw uploadError;

      const oldPath = type === 'avatar' ? oldProfile?.avatar_url : oldProfile?.cover_url;
      if (oldPath) await supabase.storage.from('app-files').remove([oldPath]);

      const { error: dbError } = await supabase.from('user_profiles').update({ [type === 'avatar' ? 'avatar_url' : 'cover_url']: filePath }).eq('id', user.id);
      if (dbError) throw dbError;

      const { data: urlData } = await supabase.storage.from('app-files').createSignedUrl(filePath, 3600);
      if (urlData?.signedUrl) {
        if (type === 'avatar') {
          setAvatarUrl(urlData.signedUrl);
          setDetails({ ...details, avatar_url: urlData.signedUrl });
        } else {
          setCoverUrl(urlData.signedUrl);
        }
      }
    } catch(err: any) {
      setError(err.message || "Failed to upload");
    } finally {
      type === 'avatar' ? setIsUploadingAvatar(false) : setIsUploadingCover(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">
      {/* Cover Backdrop */}
      <div className="h-44 bg-stone-200 dark:bg-stone-800 relative group overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
             <Camera size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {isUploadingCover ? "Saving..." : "Change Cover"}
            </button>
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
      </div>

      <div className="px-6 -mt-16 flex flex-col items-start relative z-10 gap-6">
        <div className="relative group">
          {avatarUrl ? (
             <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white dark:border-stone-950 bg-stone-100 dark:bg-stone-800" referrerPolicy="no-referrer" />
          ) : (
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white dark:border-stone-950 ${details.avatarColor}`}>
              {details.initial}
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-9 h-9 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors cursor-pointer border-2 border-white dark:border-stone-950 z-20"
            aria-label="Upload avatar"
          >
            {isUploadingAvatar ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={16} />}
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'avatar')}
          accept="image/*"
          className="hidden" 
        />

        {error && (
          <div className="w-full flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-900/10 px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-900/50">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}
      </div>
      
      <div className="px-6 pb-12 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1.5 ml-1">Full Name</label>
            <input id="name-input" defaultValue={details.name} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-sky-500 transition-all shadow-sm" />
          </div>
          <div>
            <label htmlFor="email-input" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1.5 ml-1">Email Address</label>
            <input id="email-input" defaultValue={details.email} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-stone-100 dark:bg-stone-950 text-stone-500 dark:text-stone-400 outline-none shadow-sm cursor-not-allowed" disabled />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 ml-1">Email verification is required for changes.</p>
          </div>
          <div>
            <label htmlFor="phone-input" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1.5 ml-1">Phone Number</label>
            <input id="phone-input" defaultValue={details.phone} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-sky-500 transition-all shadow-sm" />
          </div>
        </div>
        
        <Btn label="Save Profile Changes" full variant="primary" />
      </div>
    </div>
  );
}

function PasswordSecurityView() {
  const [mfa, setMfa] = useState(false);
  return (
    <div className="p-6 flex flex-col gap-8 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">Change Password</h3>
        <div>
          <label htmlFor="cur-pass" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1">Current Password</label>
          <input type="password" id="cur-pass" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-sky-500 transition-all shadow-sm" />
        </div>
        <div>
          <label htmlFor="new-pass" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1">New Password</label>
          <input type="password" id="new-pass" placeholder="Enter new password" className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-sky-500 transition-all shadow-sm" />
        </div>
        <Btn label="Update Password" full variant="secondary" />
      </div>

      <div className="bg-stone-200 dark:bg-stone-800 h-px w-full" />

      <div>
         <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-4">Extra Security</h3>
         <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">Two-Factor Auth</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">Use an Authenticator app</div>
            </div>
            <Toggle checked={mfa} onChange={() => setMfa(!mfa)} />
         </div>
      </div>
    </div>
  );
}

function ActiveSessionsView() {
  return (
    <div className="p-6 animate-fade-in">
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 font-sans">
        You are currently logged in to these devices. Manage your active sessions to ensure account security.
      </p>
      <div className="flex flex-col gap-4">
        {/* Current Device */}
        <div className="p-4 bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
             <Smartphone size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans flex items-center gap-2">
              iPhone 13 
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Current</span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-sans truncate">Safari Browser · Mumbai, India</div>
            <div className="text-xs text-stone-400 dark:text-stone-500 font-sans mt-1">Active right now</div>
          </div>
        </div>

        {/* Other Device */}
        <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0">
             <Laptop size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">
              Windows PC
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-sans truncate">Chrome Browser · Delhi, India</div>
            <div className="text-xs text-stone-400 dark:text-stone-500 font-sans mt-1">Last active: 2 hours ago</div>
          </div>
          <button className="text-rose-600 text-xs font-bold font-sans p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
            Revoke
          </button>
        </div>
      </div>
      <div className="mt-8">
        <Btn label="Sign out of all other devices" variant="danger" full />
      </div>
    </div>
  );
}

function NotificationsView() {
  const [nots, setNots] = useState({ 
    push: true, 
    email: false, 
    classes: true, 
    assignments: true, 
    messages: true,
    system: false 
  });
  
  const T = ({ k, title, sub }: { k: keyof typeof nots, title: string, sub: string }) => (
    <div className="flex items-center justify-between p-4 mix-blend-multiply dark:mix-blend-normal">
      <div className="pr-4">
        <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">{title}</div>
        <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">{sub}</div>
      </div>
      <Toggle checked={nots[k]} onChange={() => setNots({ ...nots, [k]: !nots[k] })} />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6 animate-fade-in">
      <div>
         <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Delivery Methods</div>
         <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm divide-y divide-stone-100 dark:divide-stone-800">
           <T k="push" title="Push Notifications" sub="Receive alerts directly on your device." />
           <T k="email" title="Email Summaries" sub="Daily digests sent to your email." />
         </div>
      </div>
      <div>
         <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Notification Types</div>
         <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm divide-y divide-stone-100 dark:divide-stone-800">
           <T k="classes" title="Class Reminders" sub="15 minutes before classes start." />
           <T k="assignments" title="Assignments" sub="When new homework is assigned or graded." />
           <T k="messages" title="Messages" sub="When teachers or admin send direct messages." />
           <T k="system" title="System Alerts" sub="Drona platform updates and maintenance." />
         </div>
      </div>
    </div>
  );
}

function PrivacyView() {
  const [priv, setPriv] = useState({ 
    visible: true, 
    analytics: true, 
    contacts: false 
  });
  
  const T = ({ k, title, sub }: { k: keyof typeof priv, title: string, sub: string }) => (
    <div className="flex items-center justify-between p-4 mix-blend-multiply dark:mix-blend-normal">
      <div className="pr-4">
        <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">{title}</div>
        <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">{sub}</div>
      </div>
      <Toggle checked={priv[k]} onChange={() => setPriv({ ...priv, [k]: !priv[k] })} />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6 animate-fade-in">
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2 ml-2">Data Sharing</div>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm divide-y divide-stone-100 dark:divide-stone-800">
          <T k="visible" title="Profile Visibility" sub="Allow other students in your batch to see your basic profile." />
          <T k="analytics" title="Share Analytics" sub="Help improve Drona by sending anonymous usage data." />
          <T k="contacts" title="Sync Contacts" sub="Find classmates based on your phone contacts." />
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <Btn label="Request My Data" variant="secondary" full />
        <button className="w-full p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-500 text-sm font-bold text-center cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

function HelpCenterView() {
  const faqs = [
    { q: "How do I submit an assignment?", a: "Go to 'My Work', tap on the pending assignment, attach your files, and tap 'Submit Work'." },
    { q: "What happens if I miss a class?", a: "Recorded lectures are usually posted in the 'Notes' or 'Library' section 24 hours after completion." },
    { q: "How do I contact support?", a: "You can email us directly at support@drona.edu or call the admin office during working hours." }
  ];

  const handleResetOnboarding = () => {
    localStorage.removeItem('drona_onboarding_done');
    window.location.reload();
  };

  return (
    <div className="p-6 animate-fade-in">
       <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900 p-6 rounded-2xl mb-8 flex flex-col items-center text-center">
         <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 rounded-full text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
           <CircleHelp size={24} />
         </div>
         <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans">Need assistance?</h3>
         <p className="text-sm text-stone-500 dark:text-stone-400 font-sans mt-1 mb-4">Our support team is active Mon-Fri, 9am - 6pm.</p>
         <Btn label="Contact Support" variant="primary" />
       </div>
       
       <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-4">Developer Tools</h3>
       <div className="mb-8 p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm flex flex-col gap-3 items-start">
         <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Clear the local cache state to replay the Drona initialization sequence for testing.</span>
         <button onClick={handleResetOnboarding} className="px-4 py-2 font-bold text-sm bg-stone-200 dark:bg-stone-800 rounded-lg hover:bg-stone-300 transition-colors">Replay Onboarding</button>
       </div>

       <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-4">Frequently Asked Questions</h3>
       <div className="space-y-4">
         {faqs.map((faq, i) => (
           <div key={i} className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
             <div className="font-bold text-stone-900 dark:text-stone-50 text-sm font-sans mb-1">{faq.q}</div>
             <div className="text-sm text-stone-500 dark:text-stone-400 font-sans leading-relaxed">{faq.a}</div>
           </div>
         ))}
       </div>
    </div>
  );
}

function TermsView() {
  return (
    <div className="p-6 animate-fade-in prose dark:prose-invert prose-sm font-sans prose-stone w-full max-w-none pb-20">
      <div className="text-xs text-stone-400 dark:text-stone-500 mb-6 font-bold uppercase tracking-widest">Last Updated: October 2023</div>
      
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-full break-words">
        Welcome to Drona platform. These Terms of Service ("Terms") dictate how you can use our mobile application, websites, and associated services. By creating an account or using our services, you agree to these Terms. If you do not agree to all the terms, please do not use the application.
      </p>

      <h3 className="font-bold text-stone-900 dark:text-stone-50 mt-6 mb-2 text-base">User Responsibilities</h3>
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-full break-words">
        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. The platform is designed for educational purposes; any misuse involving hate speech, academic dishonesty, or spam will result in immediate suspension.
      </p>

      <h3 className="font-bold text-stone-900 dark:text-stone-50 mt-6 mb-2 text-base">Content Ownership</h3>
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-full break-words">
        All course material, videos, lectures, and notes provided via this application remain the intellectual property of the institution. You may not distribute, reproduce, or resell these materials without explicit written consent.
      </p>
      
      <h3 className="font-bold text-stone-900 dark:text-stone-50 mt-6 mb-2 text-base">Limitation of Liability</h3>
      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-full break-words">
        Drona provides the platform on an "as is" and "as available" basis. We do not warrant that the application will be uninterrupted, error-free, or completely secure. In no event shall Drona be liable for any indirect or consequential damages.
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component Primitives
// -----------------------------------------------------------------------------

function SettingsItem({ icon, label, value, noBorder, onClick }: { 
  icon?: ReactNode; 
  label: string; 
  value?: string;
  noBorder?: boolean; 
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      disabled={!onClick && !value}
      className={`w-full p-4 flex items-center gap-3 bg-white dark:bg-stone-900 transition-colors text-left font-sans ${onClick ? 'hover:bg-stone-50 dark:hover:bg-stone-800/50 active:bg-stone-100 dark:active:bg-stone-800 cursor-pointer' : ''} ${noBorder ? '' : 'border-b border-stone-100 dark:border-stone-800/50'}`}
    >
      {icon && (
        <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center text-stone-600 dark:text-stone-400 shrink-0 border border-stone-100 dark:border-stone-800/50">
          {icon}
        </div>
      )}
      <div className="flex-1 text-sm font-semibold text-stone-900 dark:text-stone-50">
        {label}
      </div>
      {value ? (
        <div className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {value}
        </div>
      ) : onClick ? (
        <ChevronRight size={18} className="text-stone-400 dark:text-stone-500" />
      ) : null}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button 
      role="switch" 
      aria-checked={checked} 
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer shrink-0 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${checked ? 'bg-emerald-500 border-emerald-500' : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700'}`}
    >
      <div className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
    </button>
  );
}
