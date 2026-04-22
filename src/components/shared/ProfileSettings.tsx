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
  const [profile, setProfile] = useState<{name: string, email: string, phone: string, avatarColor: string, initial: string, avatar_url?: string, meta?: string}>({
    name: "Loading...",
    email: "Loading...",
    phone: "Pending Setup",
    initial: "D",
    meta: "",
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
        meta: data?.meta || "",
        avatar_url: finalAvatarUrl || undefined,
        avatarColor: role === "student" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : (role === "teacher" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300")
      });
    }
    load();
  }, [role]);

  // Render Sub-pages
  if (activePage !== 'main') {
    return (
      <div className="flex-1 flex flex-col w-full bg-stone-50 md:bg-white dark:bg-stone-950 md:dark:bg-stone-900 animate-slide-in-right overflow-hidden premium-texture relative">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800" />
        {/* Sub-page Header */}
        <div className="px-6 py-8 pb-6 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-20 border-b border-stone-200 dark:border-stone-800">
           <div className="max-w-4xl mx-auto w-full">
             <button onClick={() => setActivePage('main')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-50 transition-colors mb-6 group cursor-pointer z-10 relative bg-transparent border-none">
               <div className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center bg-white dark:bg-stone-900 shadow-sm group-hover:scale-105 transition-all">
                  <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
               </div>
               Back to Settings
             </button>
             <h1 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans relative z-10">
              {activePage === 'personal_info' && 'Personal Information'}
              {activePage === 'security' && 'Password & Security'}
              {activePage === 'sessions' && 'Active Sessions'}
              {activePage === 'notifications' && 'Notifications'}
              {activePage === 'privacy' && 'Privacy'}
              {activePage === 'help' && 'Help Center'}
              {activePage === 'terms' && 'Terms of Service'}
             </h1>
           </div>
        </div>

        {/* Sub-page Content */}
        <div className="flex-1 overflow-y-auto w-full relative z-10">
          {activePage === 'personal_info' && <PersonalInfoView details={profile} setDetails={setProfile} role={role} />}
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
    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col w-full animate-fade-in premium-texture">
      {/* Header */}
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-20 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans">Profile & Settings</h1>
      </div>

      <div className="px-6 py-6 pb-24 flex flex-col gap-8 overflow-y-auto scrollbar-hide max-w-4xl mx-auto w-full">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 flex items-center gap-5 border border-stone-200/60 dark:border-stone-800/60 shadow-sm cursor-pointer hover:border-amber-200 dark:hover:border-amber-900/40 hover:-translate-y-1 hover:shadow-xl transition-all group"
             onClick={() => setActivePage('personal_info')}>
          {profile.avatar_url ? (
             <img src={profile.avatar_url} alt="Profile" className="w-16 h-16 rounded-[20px] object-cover shrink-0 border border-stone-200 dark:border-stone-800 shadow-sm" referrerPolicy="no-referrer" />
          ) : (
            <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl font-black shrink-0 ${profile.avatarColor} shadow-inner`}>
              {profile.initial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans truncate group-hover:text-amber-600 transition-colors uppercase tracking-tight">{profile.name}</h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 font-sans truncate">{profile.email}</p>
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-stone-50 dark:bg-stone-800 rounded-full text-stone-400 dark:text-stone-500 pointer-events-none group-hover:text-amber-500 group-hover:scale-110 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Account Group */}
        <div>
          <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-3 ml-2">Account</div>
          <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden shadow-sm">
            <SettingsItem icon={<User size={18} />} label="Personal Information" onClick={() => setActivePage('personal_info')} />
            <SettingsItem icon={<Key size={18} />} label="Password & Security" onClick={() => setActivePage('security')} />
            <SettingsItem icon={<MonitorSmartphone size={18} />} label="Active Sessions" onClick={() => setActivePage('sessions')} noBorder />
          </div>
        </div>

        {/* Preferences Group */}
        <div>
          <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-3 ml-2">Preferences</div>
          <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden shadow-sm">
            <SettingsItem icon={<Bell size={18} />} label="Notifications" onClick={() => setActivePage('notifications')} />
            <SettingsItem icon={<Shield size={18} />} label="Privacy" onClick={() => setActivePage('privacy')} noBorder />
          </div>
        </div>

        {/* Support Group */}
        <div>
          <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-3 ml-2">Support</div>
          <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden shadow-sm">
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
          className="w-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-900/50 rounded-[24px] p-5 flex items-center justify-center gap-2 text-rose-600 dark:text-rose-500 font-black tracking-[0.2em] text-[10px] uppercase font-sans shadow-sm hover:bg-rose-100 hover:border-rose-300 dark:hover:bg-rose-500/20 transition-all active:scale-[0.98] cursor-pointer group hover:-translate-y-0.5"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>

      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-views 
// -----------------------------------------------------------------------------

function PersonalInfoView({ details, setDetails, role }: { details: any, setDetails: any, role: Role }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(details.avatar_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempName, setTempName] = useState(details.name);
  const [tempPhone, setTempPhone] = useState(details.phone);
  const [tempMeta, setTempMeta] = useState(details.meta);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase.from('user_profiles').select('avatar_url, cover_url, full_name, phone, meta').eq('id', user.id).single();
    if (data) {
      if (data.full_name) setTempName(data.full_name);
      if (data.phone) setTempPhone(data.phone);
      if (data.meta) setTempMeta(data.meta);
    }
    if (data?.avatar_url) {
      const { data: signedAvatar } = await supabase.storage.from('app-files').createSignedUrl(data.avatar_url, 3600);
      if (signedAvatar?.signedUrl) {
        setAvatarUrl(signedAvatar.signedUrl);
        setDetails((prev: any) => ({ ...prev, avatar_url: signedAvatar.signedUrl }));
      }
    }
    if (data?.cover_url) {
      const { data: signedCover } = await supabase.storage.from('app-files').createSignedUrl(data.cover_url, 3600);
      if (signedCover?.signedUrl) setCoverUrl(signedCover.signedUrl);
    }
  };

  const handleSaveInfo = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: dbError } = await supabase.from('user_profiles').update({
        full_name: tempName,
        phone: tempPhone,
        meta: tempMeta
      }).eq('id', user.id);

      if (dbError) throw dbError;

      setDetails((prev: any) => ({
        ...prev,
        name: tempName,
        phone: tempPhone,
        meta: tempMeta,
        initial: tempName.charAt(0).toUpperCase()
      }));

      // Show success feedback without blocking alert
      const btn = document.getElementById('save-profile-btn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Saved ✓';
        setTimeout(() => { if (btn) btn.textContent = orig; }, 2000);
      }

    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
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
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-4xl mx-auto w-full pb-24">
      {/* Cover Backdrop */}
      <div className="h-48 md:h-64 bg-stone-200 dark:bg-stone-800 relative group overflow-hidden md:rounded-b-[40px] shadow-sm">
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
             <Camera size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white px-6 py-3 rounded-[20px] text-[10px] uppercase font-black tracking-widest shadow-xl active:scale-95 transition-all cursor-pointer hover:bg-white flex items-center gap-2"
            >
              <Camera size={16} />
              {isUploadingCover ? "Saving..." : "Change Cover"}
            </button>
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
      </div>

      <div className="px-6 -mt-20 flex flex-col items-start relative z-10 gap-8">
        <div className="relative group">
          {avatarUrl ? (
             <img src={avatarUrl} alt="Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] object-cover shadow-2xl border-[6px] border-stone-50 dark:border-stone-950 bg-stone-100 dark:bg-stone-800" referrerPolicy="no-referrer" />
          ) : (
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[32px] flex items-center justify-center text-5xl md:text-6xl font-black shadow-2xl border-[6px] border-stone-50 dark:border-stone-950 shadow-inner ${details.avatarColor}`}>
              {details.initial}
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-stone-50 dark:border-stone-950 z-20"
            aria-label="Upload avatar"
          >
            {isUploadingAvatar ? <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={20} />}
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
          <div className="w-full flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-900/10 px-4 py-3 rounded-[24px] border border-rose-200 dark:border-rose-900/50">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}
      </div>
      
      <div className="px-6 pb-12 space-y-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="name-input" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">Full Name</label>
            <input 
              id="name-input" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 transition-all shadow-sm focus:ring-4 focus:ring-amber-500/10" 
            />
          </div>
          <div>
            <label htmlFor="email-input" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">Email Address</label>
            <input id="email-input" defaultValue={details.email} className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-stone-100 dark:bg-stone-950 text-stone-500 dark:text-stone-400 outline-none shadow-sm cursor-not-allowed" disabled />
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-600 dark:text-amber-500 mt-2 ml-1">Email verification is required for changes.</p>
          </div>
          <div>
            <label htmlFor="phone-input" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">Phone Number</label>
            <input 
              id="phone-input" 
              value={tempPhone} 
              onChange={(e) => setTempPhone(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 transition-all shadow-sm focus:ring-4 focus:ring-amber-500/10" 
            />
          </div>
          <div>
            <label htmlFor="meta-input" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">
              {role === 'student' ? 'Class / Grade' : (role === 'teacher' ? 'Teaching Subject' : 'Reference Info')}
            </label>
            <input 
              id="meta-input" 
              value={tempMeta} 
              onChange={(e) => setTempMeta(e.target.value)}
              placeholder={role === 'student' ? "e.g. Class 10" : "e.g. Mathematics"}
              className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 transition-all shadow-sm focus:ring-4 focus:ring-amber-500/10 placeholder:font-medium placeholder:text-stone-400" 
            />
          </div>
        </div>
        
        <Btn 
          id="save-profile-btn"
          label={isSaving ? "Saving..." : "Save Profile Changes"} 
          full 
          variant="primary" 
          onClick={handleSaveInfo}
          disabled={isSaving}
        />
      </div>
    </div>
  );
}

function PasswordSecurityView() {
  const [mfa, setMfa] = useState(false);
  return (
    <div className="px-6 py-6 pb-24 flex flex-col gap-10 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="cur-pass" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">Current Password</label>
            <input type="password" id="cur-pass" placeholder="••••••••" className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 transition-all shadow-sm focus:ring-4 focus:ring-amber-500/10 placeholder:text-stone-400" />
          </div>
          <div>
            <label htmlFor="new-pass" className="block text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-3 ml-1">New Password</label>
            <input type="password" id="new-pass" placeholder="Enter new password" className="w-full px-5 py-4 rounded-[20px] border border-stone-200 dark:border-stone-800 font-sans text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 transition-all shadow-sm focus:ring-4 focus:ring-amber-500/10 placeholder:text-stone-400" />
          </div>
        </div>
        <Btn label="Update Password" full variant="secondary" />
      </div>

      <div className="bg-stone-200/50 dark:bg-stone-800/50 h-px w-full" />

      <div>
         <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-6">Extra Security</h3>
         <div className="flex items-center justify-between p-6 bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm">
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-stone-900 dark:text-stone-50 font-sans mb-2">Two-Factor Auth</div>
              <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">Use an Authenticator app</div>
            </div>
            <Toggle checked={mfa} onChange={() => setMfa(!mfa)} />
         </div>
      </div>
    </div>
  );
}

function ActiveSessionsView() {
  return (
    <div className="px-6 py-6 pb-24 animate-fade-in max-w-4xl mx-auto w-full">
      <p className="text-sm font-bold text-stone-500 dark:text-stone-400 mb-8 font-sans max-w-xl">
        You are currently logged in to these devices. Manage your active sessions to ensure account security.
      </p>
      <div className="flex flex-col gap-4">
        {/* Current Device */}
        <div className="p-6 bg-white dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-500/50 rounded-[24px] shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
             <Smartphone size={24} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans flex items-center gap-3 tracking-tight mb-1">
              iPhone 13 
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md font-black uppercase tracking-[0.2em] shadow-inner">Current</span>
            </div>
            <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans truncate">Safari Browser · Mumbai, India</div>
            <div className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-widest mt-2">Active right now</div>
          </div>
        </div>

        {/* Other Device */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-[24px] shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-[16px] bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700 shadow-inner">
             <Laptop size={24} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-1">
              Windows PC
            </div>
            <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans truncate">Chrome Browser · Delhi, India</div>
            <div className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-widest mt-2">Last active: 2 hours ago</div>
          </div>
          <button className="text-rose-600 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest p-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/50 active:scale-95">
            Revoke
          </button>
        </div>
      </div>
      <div className="mt-10">
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
    <div className="flex items-center justify-between p-6">
      <div className="pr-4">
        <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-1">{title}</div>
        <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">{sub}</div>
      </div>
      <Toggle checked={nots[k]} onChange={() => setNots({ ...nots, [k]: !nots[k] })} />
    </div>
  );

  return (
    <div className="px-6 py-6 pb-24 flex flex-col gap-10 animate-fade-in max-w-4xl mx-auto w-full">
      <div>
         <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-4 ml-2">Delivery Methods</div>
         <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm divide-y divide-stone-100 dark:divide-stone-800/50">
           <T k="push" title="Push Notifications" sub="Receive alerts directly on your device." />
           <T k="email" title="Email Summaries" sub="Daily digests sent to your email." />
         </div>
      </div>
      <div>
         <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-4 ml-2">Notification Types</div>
         <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm divide-y divide-stone-100 dark:divide-stone-800/50">
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
    <div className="flex items-center justify-between p-6">
      <div className="pr-4">
        <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-1">{title}</div>
        <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">{sub}</div>
      </div>
      <Toggle checked={priv[k]} onChange={() => setPriv({ ...priv, [k]: !priv[k] })} />
    </div>
  );

  return (
    <div className="px-6 py-6 pb-24 flex flex-col gap-10 animate-fade-in max-w-4xl mx-auto w-full">
      <div>
        <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-4 ml-2">Data Sharing</div>
        <div className="bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm divide-y divide-stone-100 dark:divide-stone-800/50">
          <T k="visible" title="Profile Visibility" sub="Allow other students in your batch to see your basic profile." />
          <T k="analytics" title="Share Analytics" sub="Help improve Drona by sending anonymous usage data." />
          <T k="contacts" title="Sync Contacts" sub="Find classmates based on your phone contacts." />
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <Btn label="Request My Data" variant="secondary" full />
        <button className="w-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-900/50 rounded-[24px] p-5 flex items-center justify-center gap-2 text-rose-600 dark:text-rose-500 font-black tracking-[0.2em] text-[10px] uppercase font-sans shadow-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all active:scale-[0.98] cursor-pointer">
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
    <div className="px-6 py-6 pb-24 animate-fade-in max-w-4xl mx-auto w-full">
       <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-900/50 p-8 rounded-[32px] mb-12 flex flex-col items-center text-center shadow-inner relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-color-dodge transition-opacity duration-1000 group-hover:opacity-20 text-sky-500" />
         <div className="w-16 h-16 bg-sky-100 dark:bg-sky-500/20 rounded-[20px] text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 shadow-inner border border-sky-100 dark:border-sky-900/40 relative z-10">
           <CircleHelp size={28} />
         </div>
         <h3 className="text-3xl font-black text-sky-900 dark:text-sky-50 font-sans tracking-tight relative z-10">Need assistance?</h3>
         <p className="text-sm font-bold text-sky-700/70 dark:text-sky-300/70 font-sans mt-2 mb-8 max-w-sm relative z-10">Our support team is active Mon-Fri, 9am - 6pm. We're here to help you succeed.</p>
         <Btn label="Contact Support" variant="primary" className="relative z-10 bg-sky-500 hover:bg-sky-400 border-none shadow-sky-500/20" />
       </div>
       
       <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-4 ml-2">Troubleshooting</h3>
       <div className="mb-12 p-6 bg-stone-100 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 rounded-[24px] shadow-inner flex flex-col gap-4 items-start">
         <span className="text-sm font-bold text-stone-600 dark:text-stone-400">Reset the onboarding flow — useful if you want to see the intro screens again or are testing the app.</span>
         <button onClick={handleResetOnboarding} className="px-5 py-3 font-black tracking-widest text-[10px] uppercase bg-stone-200 dark:bg-stone-800 rounded-[16px] hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors shadow-sm active:scale-95 border border-stone-300 dark:border-stone-700/50 text-stone-700 dark:text-stone-300">Replay Onboarding</button>
       </div>

       <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-4 ml-2">Frequently Asked Questions</h3>
       <div className="space-y-4">
         {faqs.map((faq, i) => (
           <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-[24px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-md transition-shadow">
             <div className="font-black text-stone-900 dark:text-stone-50 text-xl font-sans mb-2 tracking-tight">{faq.q}</div>
             <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans leading-relaxed">{faq.a}</div>
           </div>
         ))}
       </div>
    </div>
  );
}

function TermsView() {
  return (
    <div className="px-6 py-6 pb-24 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200/60 dark:border-stone-800/60 p-8 shadow-sm">
        <div className="text-[10px] text-stone-400 dark:text-stone-500 mb-8 font-black uppercase tracking-[0.2em]">Last Updated: October 2026</div>
        
        <div className="prose dark:prose-invert prose-stone max-w-none">
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base font-medium">
            Welcome to Drona platform. These Terms of Service ("Terms") dictate how you can use our mobile application, websites, and associated services. By creating an account or using our services, you agree to these Terms. If you do not agree to all the terms, please do not use the application.
          </p>

          <h3 className="font-black text-stone-900 dark:text-stone-50 mt-10 mb-4 text-xl tracking-tight">User Responsibilities</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base font-medium">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. The platform is designed for educational purposes; any misuse involving hate speech, academic dishonesty, or spam will result in immediate suspension.
          </p>

          <h3 className="font-black text-stone-900 dark:text-stone-50 mt-10 mb-4 text-xl tracking-tight">Content Ownership</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base font-medium">
            All course material, videos, lectures, and notes provided via this application remain the intellectual property of the institution. You may not distribute, reproduce, or resell these materials without explicit written consent.
          </p>
          
          <h3 className="font-black text-stone-900 dark:text-stone-50 mt-10 mb-4 text-xl tracking-tight">Limitation of Liability</h3>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base font-medium">
            Drona provides the platform on an "as is" and "as available" basis. We do not warrant that the application will be uninterrupted, error-free, or completely secure. In no event shall Drona be liable for any indirect or consequential damages.
          </p>
        </div>
      </div>
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
      className={`w-full p-5 flex items-center gap-4 transition-colors text-left font-sans ${onClick ? 'hover:bg-stone-50/50 dark:hover:bg-stone-800/30 active:bg-stone-100 dark:active:bg-stone-800 cursor-pointer object-hover-lift' : ''} ${noBorder ? '' : 'border-b border-stone-100 dark:border-stone-800/50'} bg-transparent`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-2xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center text-stone-500 dark:text-stone-400 shrink-0 border border-stone-200/50 dark:border-stone-800/50 shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <div className="flex-1 text-sm font-bold text-stone-900 dark:text-stone-50 tracking-tight">
        {label}
      </div>
      {value ? (
        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
          {value}
        </div>
      ) : onClick ? (
        <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 group-hover:translate-x-1 transition-transform group-hover:text-amber-500" />
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
