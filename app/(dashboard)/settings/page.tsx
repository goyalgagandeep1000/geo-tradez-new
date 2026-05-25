'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Link2, Palette, Bot, Bell, CreditCard,
  Camera, ChevronRight, Save, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/mockData';
import { useAppStore } from '@/store/appStore';

const sections = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'security', icon: Lock, label: 'Security' },
  { id: 'integrations', icon: Link2, label: 'Integrations' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'ai', icon: Bot, label: 'AI Preferences' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        checked ? 'bg-[#4A7C24]' : 'bg-gray-200'
      )}
    >
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5')} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { profile, updateProfile, addToast, setTheme, theme } = useAppStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [twoFa, setTwoFa] = useState(true);
  const [loginNotify, setLoginNotify] = useState(true);
  const [notifications, setNotifications] = useState({
    orders: true,
    reviews: true,
    messages: true,
    marketing: false,
    updates: true,
  });

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* Settings Nav */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col bg-[#f5faff] border-r border-[#c8dae8]">
        <div className="p-4 border-b border-[#dce8f2]">
          <h3 className="text-sm font-bold text-[#1A1F2E]">Settings</h3>
        </div>
        <nav className="p-2 flex-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                activeSection === s.id
                  ? 'bg-[#F0F7E8] text-[#3A6B1A] font-semibold'
                  : 'text-[#6B7280] hover:bg-[#ecf4fb] hover:text-[#374151]'
              )}
            >
              <s.icon className={cn('w-4 h-4', activeSection === s.id ? 'text-[#4A7C24]' : 'text-[#9CA3AF]')} />
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1A1F2E]">Profile Settings</h2>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <h3 className="text-sm font-bold text-[#374151] mb-4">Profile Photo</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full app-image-bg" />
                    <button
                      onClick={() => addToast('Photo upload opened (demo)', 'info')}
                      className="absolute bottom-0 right-0 w-6 h-6 bg-[#4A7C24] rounded-full flex items-center justify-center shadow-sm"
                    >
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#374151]">Upload new photo</p>
                    <p className="text-xs text-[#9CA3AF]">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-4">
                <h3 className="text-sm font-bold text-[#374151] mb-2">Personal Information</h3>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 border border-[#c8dae8] rounded-lg text-sm text-[#374151] focus:outline-none focus:border-[#4A7C24] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 border border-[#c8dae8] rounded-lg text-sm text-[#374151] focus:outline-none focus:border-[#4A7C24] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#c8dae8] rounded-lg text-sm text-[#374151] focus:outline-none focus:border-[#4A7C24] resize-none bg-white"
                  />
                </div>
                <button
                  onClick={() => {
                    updateProfile({ name, email, bio });
                    addToast('Profile saved successfully');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A7C24] text-white text-sm font-medium rounded-lg hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.3)]"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1A1F2E]">Security Settings</h2>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-4">
                <h3 className="text-sm font-bold text-[#374151]">Change Password</h3>
                {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full h-9 px-3 pr-10 border border-[#c8dae8] rounded-lg text-sm focus:outline-none focus:border-[#4A7C24] bg-white"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addToast('Password updated successfully')}
                  className="px-4 py-2 bg-[#4A7C24] text-white text-sm font-medium rounded-lg hover:bg-[#3A6B1A]"
                >
                  Update Password
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#374151]">Two-Factor Authentication</h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Add an extra layer of security</p>
                  </div>
                  <Toggle checked={twoFa} onChange={setTwoFa} />
                </div>
                <div className="mt-4 pt-4 border-t border-[#dce8f2] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#374151]">Login Notifications</h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Get notified of new sign-ins</p>
                  </div>
                  <Toggle checked={loginNotify} onChange={setLoginNotify} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1A1F2E]">Notification Preferences</h2>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-0">
                {[
                  { key: 'orders', label: 'New Orders', desc: 'Get notified when you receive a new order' },
                  { key: 'reviews', label: 'Reviews & Ratings', desc: 'When customers leave reviews on your products' },
                  { key: 'messages', label: 'Community Messages', desc: 'New messages in channels you follow' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'Tips, updates and promotional content' },
                  { key: 'updates', label: 'Platform Updates', desc: 'New features and platform announcements' },
                ].map((item, i) => (
                  <div key={item.key} className={cn('flex items-center justify-between py-4', i > 0 && 'border-t border-[#dce8f2]')}>
                    <div>
                      <p className="text-sm font-semibold text-[#374151]">{item.label}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1A1F2E]">Appearance</h2>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <h3 className="text-sm font-bold text-[#374151] mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Light', 'Dark'].map((theme) => (
                    <button
                      key={theme}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                        theme === 'Light'
                          ? 'border-[#4A7C24] bg-[#F0F7E8]'
                          : 'border-[#c8dae8] hover:border-[#4A7C24]'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg', theme === 'Light' ? 'bg-white border border-[#c8dae8]' : 'bg-gray-800')} />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#374151]">{theme}</p>
                        {theme === 'Light' && <p className="text-xs text-[#4A7C24]">Active</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Default placeholder for other sections */}
          {!['profile', 'security', 'notifications', 'appearance'].includes(activeSection) && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1A1F2E]">{sections.find(s => s.id === activeSection)?.label} Settings</h2>
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F7E8] flex items-center justify-center mx-auto mb-3">
                  {(() => {
                    const s = sections.find(s => s.id === activeSection);
                    return s ? <s.icon className="w-6 h-6 text-[#4A7C24]" /> : null;
                  })()}
                </div>
                <p className="text-sm text-[#6B7280]">This section is coming soon.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
