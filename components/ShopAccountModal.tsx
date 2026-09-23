import React, { useState } from 'react';
import { 
  X, Store, User, Mail, Phone, MapPin, Key, 
  Lock, CheckCircle2, AlertCircle, LogOut, Cloud, 
  RefreshCw, ShieldCheck, Database
} from 'lucide-react';
import { ShopUser, authService } from '../services/authService';
import { cloudResumeService } from '../services/cloudResumeService';
import { ResumeDocument } from '../types';

interface ShopAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ShopUser | null;
  onUserChange: (user: ShopUser | null) => void;
  resumes: ResumeDocument[];
  onResumesLoadedFromCloud: (resumes: ResumeDocument[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ShopAccountModal: React.FC<ShopAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  resumes,
  onResumesLoadedFromCloud,
  showToast
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'profile'>('login');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // When modal opens or user changes, populate profile tab
  React.useEffect(() => {
    if (currentUser) {
      setTab('profile');
      setShopName(currentUser.shopName || '');
      setOwnerName(currentUser.ownerName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setGeminiApiKey(currentUser.geminiApiKey || '');
    } else {
      setTab('login');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !ownerName.trim() || !email.trim() || !password.trim()) {
      showToast('দোকানের নাম, প্রোপ্রাইটরের নাম, ইমেইল এবং পাসওয়ার্ড পূরণ করা আবশ্যক।', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        shopName,
        ownerName,
        email,
        phone,
        password,
        address,
        geminiApiKey
      });
      onUserChange(res.user);
      showToast('শপ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      // Auto-sync initial local resumes to user account
      if (resumes.length > 0) {
        await cloudResumeService.syncAllResumes(resumes);
        showToast('সকল রেজুমি ক্লাউড ডেটাবেজে সংরক্ষিত হয়েছে।', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('ইমেইল ও পাসওয়ার্ড প্রদান করুন।', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      onUserChange(res.user);
      showToast(`স্বাগতম, ${res.user.shopName}!`, 'success');

      // Fetch cloud resumes
      const cloudResumes = await cloudResumeService.fetchUserResumes();
      if (cloudResumes && cloudResumes.length > 0) {
        onResumesLoadedFromCloud(cloudResumes);
        showToast(`${cloudResumes.length}টি রেজুমি ক্লাউড থেকে লোড করা হয়েছে।`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'লগইন ব্যর্থ হয়েছে।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile({
        shopName,
        ownerName,
        phone,
        address,
        geminiApiKey
      });
      onUserChange(updated);
      showToast('শপের তথ্য সফলভাবে আপডেট হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message || 'আপডেট ব্যর্থ হয়েছে।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await cloudResumeService.syncAllResumes(resumes);
      showToast(`${res.success}টি রেজুমি অনলাইন MySQL ডেটাবেজে সিঙ্ক করা হয়েছে!`, 'success');
    } catch (err) {
      showToast('ক্লাউড সিঙ্ক ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoadFromCloud = async () => {
    setIsSyncing(true);
    try {
      const cloudResumes = await cloudResumeService.fetchUserResumes();
      if (cloudResumes && cloudResumes.length > 0) {
        onResumesLoadedFromCloud(cloudResumes);
        showToast(`${cloudResumes.length}টি রেজুমি ক্লাউড থেকে লোড করা হয়েছে!`, 'success');
      } else {
        showToast('ক্লাউডে কোনো সংরক্ষিত রেজুমি পাওয়া যায়নি।', 'info');
      }
    } catch (err) {
      showToast('ক্লাউড থেকে ফেচ করা ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onUserChange(null);
    showToast('অ্যাকাউন্ট থেকে সফলভাবে লগআউট করা হয়েছে।', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {currentUser ? currentUser.shopName : 'শপ অ্যাকাউন্ট ও ক্লাউড সিঙ্ক'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser ? 'দোকানের বিবরণ ও অনলাইন ডেটাবেজ' : 'অনলাইন ব্যাকআপ ও রেজুমি ম্যানেজমেন্ট'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch if not logged in */}
        {!currentUser && (
          <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 bg-slate-50/30 dark:bg-slate-900/40">
            <button
              onClick={() => setTab('login')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative ${
                tab === 'login'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              লগইন (Login)
              {tab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all relative ${
                tab === 'register'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              নতুন অ্যাকাউন্ট (Register Shop)
              {tab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          </div>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {currentUser ? (
            /* Logged in Profile View */
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Cloud Database Status Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
                <Database className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <div className="text-xs">
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    অনলাইন MySQL ডেটাবেজ সক্রিয়
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                    আপনার দোকানের সব রেজুমি নিরাপদে অনলাইন সার্ভারে ব্যাকআপ থাকবে।
                  </p>
                </div>
              </div>

              {/* Quick Sync Controls */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                  সব রেজুমি সিঙ্ক করুন
                </button>
                <button
                  type="button"
                  onClick={handleLoadFromCloud}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Cloud size={14} />
                  ক্লাউড থেকে রিস্টোর
                </button>
              </div>

              {/* Editable Shop Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    দোকানের নাম (Shop Name)
                  </label>
                  <div className="relative">
                    <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    প্রোপ্রাইটরের নাম (Owner Name)
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      মোবাইল নম্বর (Phone)
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      ঠিকানা (Address)
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Gemini API Key */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                    <span>আপনার ব্যক্তিগত Gemini API Key</span>
                    <span className="text-[10px] text-blue-600 font-normal">আজীবন সুরক্ষিত</span>
                  </label>
                  <div className="relative">
                    <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    এখানে API কী সেভ করে রাখলে প্রতিবার আলাদা করে কী দিতে হবে না।
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  লগআউট
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
                </button>
              </div>
            </form>
          ) : tab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  ইমেইল (Email)
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shop@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  কোনো অ্যাকাউন্ট নেই? নতুন শপ অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  দোকানের নাম (Shop Name) *
                </label>
                <div className="relative">
                  <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="যেমন: মা কম্পিউটার্স / Digital Point"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  প্রোপ্রাইটর / মালিকের নাম (Owner Name) *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="আপনার নাম"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    ইমেইল (Email) *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="shop@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    মোবাইল নম্বর (Phone)
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    পাসওয়ার্ড (Password) *
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    দোকানের ঠিকানা (Address)
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বাজার/উপজেলা/জেলা"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  আপনার নিজস্ব Gemini API Key (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy... (পরেও সেট করা যাবে)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'শপ অ্যাকাউন্ট তৈরি করুন'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
