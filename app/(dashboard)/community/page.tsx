'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Hash, Mic, Lock, Radio, Volume2, Globe, Users, MapPin,
  X, ThumbsUp, Bookmark, MessageCircle, Send, Smile, ExternalLink, BarChart2
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { communityMembers, channels as mockChannels } from '@/lib/mockData';
import { useAppStore } from '@/store/appStore';

export default function CommunityPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('Global Chat');
  const { communityMessages, sendCommunityMessage, toggleReaction, openModal, channels: storeChannels } = useAppStore();
  const channels = storeChannels.length > 0 ? storeChannels : mockChannels;

  const displayMessages = (communityMessages[activeChannel] || []).map((msg) => ({
    ...msg,
    user: communityMembers.find((m) => m.id === msg.userId) || communityMembers[0],
  }));

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    sendCommunityMessage(activeChannel, trimmed);
    setMessage('');
  };

  const sections = ['ANNOUNCEMENTS', 'CUSTOM CHANNELS'];

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* Channel List */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-[#f5faff] border-r border-[#c8dae8] min-h-0">
        <div className="p-3 border-b border-[#dce8f2]">
          <button
            onClick={() => openModal('create-channel')}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#4A7C24] text-white text-sm font-medium rounded-lg hover:bg-[#3A6B1A] transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Channel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {sections.map((section) => (
            <div key={section} className="mb-3">
              <p className="text-xs font-bold text-[#9CA3AF] px-3 py-1 uppercase tracking-wider">{section}</p>
              {channels.filter((c) => c.section === section).map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChannel(ch.name);
                    if (!communityMessages[ch.name]) {
                      useAppStore.setState((s) => ({
                        communityMessages: { ...s.communityMessages, [ch.name]: [] },
                      }));
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                    ch.active || activeChannel === ch.name
                      ? 'bg-[#F0F7E8] text-[#3A6B1A] font-semibold rounded-lg mx-2 w-[calc(100%-16px)]'
                      : 'text-[#6B7280] hover:bg-[#ecf4fb] hover:text-[#374151]'
                  }`}
                >
                  {ch.type === 'announcement' ? <Radio className="w-4 h-4 shrink-0" /> :
                   ch.type === 'voice' ? <Mic className="w-4 h-4 shrink-0" /> :
                   <Hash className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{ch.name}</span>
                  {(ch.active || activeChannel === ch.name) && (
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ))}

          {/* Divider */}
          <div className="mx-3 my-3 h-px bg-[#F1F5F9]" />

          {/* Create Your Space */}
          <div className="mx-2 bg-[#ecf4fb] rounded-xl p-3 border border-[#c8dae8]">
            <p className="text-xs font-bold text-[#374151] mb-0.5">Create Your Space</p>
            <p className="text-xs text-[#9CA3AF] mb-3">Build and manage your own community areas</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: Hash, label: 'Text Channel' },
                { icon: Mic, label: 'Voice Room' },
                { icon: Lock, label: 'Private Group' },
                { icon: Radio, label: 'Live Event' },
              ].map((item) => (
                <button key={item.label} className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-lg border border-[#c8dae8] text-xs text-[#374151] hover:border-[#4A7C24] hover:text-[#4A7C24] transition-colors">
                  <item.icon className="w-3 h-3" /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom grow together community promo */}
          <div className="mx-2 mb-3 bg-[#ecf4fb] rounded-xl p-3 border border-[#c8dae8]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">🌱</span>
              <p className="text-xs font-bold text-[#374151]">Grow together,</p>
            </div>
            <p className="text-xs font-bold text-[#374151] mb-1">win together.</p>
            <p className="text-[10px] text-[#9CA3AF] mb-2 leading-relaxed">Be part of a global community built for creators and sellers.</p>
            <div className="flex -space-x-1.5">
              {communityMembers.slice(0, 4).map((m) => (
                <img key={m.id} src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border-2 border-white app-image-bg" />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
        {/* Channel Header */}
        <div className="bg-white border-b border-[#c8dae8] px-5 py-3 flex items-center gap-2 shrink-0">
          <Hash className="w-4 h-4 text-[#6B7280]" />
          <h2 className="text-base font-bold text-[#1A1F2E]">{activeChannel}</h2>
          <div className="w-2 h-2 rounded-full bg-green-500 ml-1" />
          <span className="text-sm text-[#9CA3AF]">Live</span>
        </div>

        {/* Messages — scrollable; input stays fixed below */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-5 pb-2">
          {/* Welcome Banner */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#c8dae8] p-5 relative shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F0F7E8] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#4A7C24]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1F2E]">Welcome to Global Chat 👋</h3>
                  <p className="text-sm text-[#6B7280]">Connect with creators, sellers, and entrepreneurs from 180+ countries</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {['Share Ideas', 'Find Partners', 'Grow Globally'].map((btn) => (
                  <button key={btn} className="px-3 py-1.5 bg-[#F0F7E8] border border-[#E8F5D8] rounded-full text-xs font-medium text-[#3A6B1A] hover:bg-[#E8F5D8] transition-colors">
                    {btn}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {displayMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 group"
            >
              <Avatar src={msg.user.avatar} name={msg.user.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#1A1F2E]">{msg.user.name}</span>
                  <span className="text-xs text-[#9CA3AF]">{msg.user.flag}</span>
                  <span className="text-xs text-[#9CA3AF]">{msg.time}</span>
                </div>
                <p className="text-sm text-[#374151] leading-relaxed">{msg.content}</p>

                {/* Embed */}
                {msg.embed && (
                  <div className="mt-2 inline-flex items-center gap-2.5 bg-white border border-[#c8dae8] rounded-xl px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {msg.embed.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1F2E]">{msg.embed.title}</p>
                      <p className="text-xs text-[#9CA3AF]">{msg.embed.subtitle}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] ml-2" />
                  </div>
                )}

                {/* Reactions + Actions */}
                <div className="flex items-center gap-3 mt-2">
                  {msg.reactions.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => toggleReaction(activeChannel, msg.id, r.emoji)}
                      className="flex items-center gap-1 bg-[#ecf4fb] border border-[#c8dae8] rounded-full px-2 py-0.5 text-xs hover:border-[#4A7C24] hover:bg-[#F0F7E8] transition-colors"
                    >
                      {r.emoji} <span className="text-[#6B7280] font-medium">{r.count}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => toggleReaction(activeChannel, msg.id, '👍')}
                    className="hidden group-hover:flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    <ThumbsUp className="w-3 h-3" /> React
                  </button>
                  <div className="hidden group-hover:flex items-center gap-2 ml-2">
                    {[
                      { icon: MessageCircle, label: 'Reply' },
                      { icon: ThumbsUp, label: 'React' },
                      { icon: Bookmark, label: 'Save' },
                      { icon: MessageCircle, label: 'DM' },
                    ].map(({ icon: Icon, label }) => (
                      <button key={label} className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#6B7280]">
                        <Icon className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input — pinned to bottom of chat column, above mobile nav */}
        <div className="shrink-0 sticky bottom-0 z-20 bg-white border-t border-[#c8dae8] px-4 sm:px-5 py-3 shadow-[0_-4px_16px_rgba(20,40,80,0.06)]">
          <div className="flex items-center gap-2 sm:gap-3 bg-[#ecf4fb] border border-[#c8dae8] rounded-xl px-3 sm:px-4 py-2.5 focus-within:border-[#4A7C24] focus-within:ring-2 focus-within:ring-[#4A7C24]/15 transition-colors">
            <Paperclip className="w-4 h-4 text-[#9CA3AF] cursor-pointer hover:text-[#6B7280] shrink-0" />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${activeChannel}...`}
              className="flex-1 min-w-0 bg-transparent text-sm text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none"
            />
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] shrink-0">
              <Smile className="w-4 h-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-8 h-8 rounded-lg bg-[#4A7C24] flex items-center justify-center text-white hover:bg-[#3A6B1A] disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="hidden xl:flex w-60 shrink-0 flex-col bg-[#f5faff] border-l border-[#c8dae8] p-4 min-h-0">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-[#4A7C24]" />
          <h3 className="text-sm font-bold text-[#1A1F2E]">Community Overview</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: '12.8K', label: 'Members', icon: Users },
            { val: '1.4K', label: 'Online', icon: Globe },
            { val: '180+', label: 'Countries', icon: MapPin },
          ].map((s) => (
            <div key={s.label} className="text-center bg-[#ecf4fb] rounded-xl p-2.5 border border-[#c8dae8]">
              <p className="text-base font-bold text-[#1A1F2E]">{s.val}</p>
              <p className="text-xs text-[#9CA3AF]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#F1F5F9] mb-4" />

        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#374151] uppercase tracking-wide">Online Members</h4>
          <button className="text-xs text-[#4A7C24] font-medium hover:text-[#3A6B1A]">View all</button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {communityMembers.slice(0, 5).map((member) => (
            <div key={member.id} className="flex items-center gap-2.5">
              <Avatar src={member.avatar} name={member.name} size="sm" online={member.online} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1F2E] truncate">
                  {member.name} {member.id === '1' && <span className="text-[#9CA3AF] font-normal">(You)</span>}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate">{member.flag} {member.country}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overflow avatars */}
        <div className="mt-4 pt-3 border-t border-[#dce8f2] flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {communityMembers.slice(0, 3).map((m) => (
              <img key={m.id} src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border-2 border-white app-image-bg" />
            ))}
          </div>
          <span className="text-xs text-[#6B7280] font-medium">+1,427 online</span>
        </div>
      </aside>
    </div>
  );
}

function Paperclip({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}
