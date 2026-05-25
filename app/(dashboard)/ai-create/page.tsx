'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, MessageCircle, Crown, ChevronRight,
  Paperclip, Send, Lightbulb, Megaphone, Store, Image, Mail,
  PenLine, ArrowRight, Sparkles, ChevronDown, X
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

const workflowSteps = [
  {
    icon: Lightbulb,
    title: 'Product Idea',
    desc: 'AI-powered digital bundle for creators',
    progress: 40,
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: Megaphone,
    title: 'Ad Copy',
    desc: 'Turn visitors into buyers with better hooks',
    progress: 60,
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Store,
    title: 'Store Page',
    desc: 'SEO-ready product page draft',
    progress: 75,
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Sparkles,
    title: 'Ready to Export',
    desc: 'Final polished asset package',
    progress: 90,
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-[#F0F7E8]',
    iconColor: 'text-[#4A7C24]',
  },
];

const suggestions = [
  { icon: PenLine,   label: 'Write product description' },
  { icon: Megaphone, label: 'Generate ad copy' },
  { icon: Store,     label: 'Create store page' },
  { icon: Lightbulb, label: 'Suggest business ideas' },
  { icon: Image,     label: 'Make image prompt' },
  { icon: Mail,      label: 'Write email campaign' },
];

export default function AICreatePage() {
  const [inputValue, setInputValue] = useState('');
  const {
    aiThreads,
    activeAiThreadId,
    createAiThread,
    setActiveAiThread,
    sendAiMessage,
    clearActiveAiThread,
    openModal,
    addToast,
  } = useAppStore();

  const activeThread = aiThreads.find((t) => t.id === activeAiThreadId) ?? aiThreads[0];
  const hasMessages = (activeThread?.messages.length ?? 0) > 0;

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendAiMessage(trimmed);
    setInputValue('');
  };

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* ── Chat History Sidebar ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#f5faff] border-r border-[#c8dae8]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#dce8f2]">
          <h3 className="text-sm font-bold text-[#1A1F2E]">Recent Chats</h3>
          <div className="flex gap-1">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb]">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb]">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-3 py-3 border-b border-[#dce8f2]">
          <button
            onClick={() => createAiThread()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A7C24] text-white text-sm font-bold rounded-xl hover:bg-[#3A6B1A] transition-colors shadow-[0_2px_8px_rgba(74,124,36,0.25)]"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {aiThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveAiThread(thread.id)}
              className={cn(
                'w-full flex items-start gap-2.5 px-3 py-3 hover:bg-[#ecf4fb] transition-colors text-left group',
                activeAiThreadId === thread.id && 'bg-[#F0F7E8]'
              )}
            >
              <div className="w-7 h-7 rounded-lg bg-[#F0F7E8] flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#4A7C24]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1F2E] truncate">{thread.title}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-[#9CA3AF]">{thread.messages.length} messages</span>
                </div>
              </div>
            </button>
          ))}
          <button className="w-full px-3 py-3 text-xs text-[#4A7C24] font-semibold flex items-center gap-1 hover:text-[#3A6B1A]">
            View all chats <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pro badge */}
        <div className="mx-3 mb-3 p-3 bg-[#F0F7E8] rounded-xl border border-[#E8F5D8]">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-[#4A7C24]" />
            <span className="text-xs font-bold text-[#2D5016]">Pro Seller</span>
          </div>
          <p className="text-xs text-[#6B7280] mb-1.5">You&apos;re on the Pro plan</p>
          <button
            onClick={() => openModal('upgrade-pro')}
            className="text-xs text-[#4A7C24] font-medium flex items-center gap-1"
          >
            Unlock all features <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Decorative sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[
            { top: '6%',  left: '12%'  },
            { top: '10%', right: '8%'  },
            { top: '28%', right: '4%'  },
            { top: '50%', left: '5%'   },
            { top: '68%', right: '12%' },
            { top: '18%', left: '42%'  },
            { top: '38%', right: '28%' },
          ].map((pos, i) => (
            <motion.span key={i}
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
              className="absolute text-[#4A7C24]/20 font-bold text-xl select-none"
              style={pos as any}
            >✦</motion.span>
          ))}
          {/* Faint icon overlays top-right */}
          <div className="absolute top-10 right-20 opacity-[0.07]">
            <PenLine className="w-14 h-14 text-[#4A7C24]" />
          </div>
          <div className="absolute top-4 right-8 opacity-[0.06]">
            <Image className="w-10 h-10 text-[#6B7280]" />
          </div>
          <div className="absolute top-24 right-36 opacity-[0.06]">
            <Sparkles className="w-8 h-8 text-[#4A7C24]" />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-4xl mx-auto px-8 pt-12 pb-6">

            {/* ── Big heading ── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h1 className="text-6xl font-extrabold text-[#1A1F2E] mb-4 leading-tight tracking-tight"
                style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                AI Create
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg mx-auto">
                Create products, content, ads, images, store pages,<br />
                scripts, and business assets with powerful AI.
              </p>
            </motion.div>

            {/* ── Creative Workspace ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-[#c8dae8] p-6 mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F7E8] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#4A7C24]" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#1A1F2E]">Creative Workspace</h2>
                </div>
                {/* Steps breadcrumb */}
                <div className="flex items-center gap-2 text-sm">
                  {['Idea', 'Draft', 'Improve', 'Export'].map((step, i, arr) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className={`font-bold ${i === arr.length - 1 ? 'text-[#4A7C24]' : 'text-[#374151]'}`}>{step}</span>
                      {i < arr.length - 1 && <span className="text-[#9CA3AF] font-bold">→</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step cards — bigger */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {workflowSteps.map((step, i) => (
                  <div key={step.title} className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                      className={`rounded-2xl border p-5 cursor-pointer transition-all ${step.color}`}
                    >
                      {/* Icon + sparkle */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${step.iconBg}`}>
                          <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                        </div>
                        <span className="text-[#4A7C24]/40 text-base select-none">✦</span>
                      </div>
                      {/* Title */}
                      <p className="text-sm font-extrabold text-[#1A1F2E] mb-1.5">{step.title}</p>
                      <p className="text-xs text-[#6B7280] leading-snug mb-4">{step.desc}</p>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-[#4A7C24] rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-1.5 text-right">{step.progress}%</p>
                    </motion.div>
                    {/* Arrow between cards */}
                    {i < workflowSteps.length - 1 && (
                      <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-[#c8dae8] shadow-sm items-center justify-center text-[#9CA3AF] font-bold text-sm">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Suggestions ── */}
            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-6"
              >
                <p className="text-sm font-bold text-[#374151] mb-3">Suggestions for you:</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scroll-hide">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setInputValue(s.label)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c8dae8] rounded-full text-sm text-[#374151] hover:border-[#4A7C24] hover:bg-[#F0F7E8] hover:text-[#3A6B1A] transition-all shadow-[0_1px_4px_rgba(0,0,0,0.05)] whitespace-nowrap shrink-0 font-medium"
                    >
                      <s.icon className="w-3.5 h-3.5 text-[#6B7280]" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Chat messages ── */}
            {hasMessages && (
              <div className="space-y-4 mb-6">
                {activeThread?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'bg-[#4A7C24] text-white rounded-br-md'
                          : 'bg-white border border-[#c8dae8] text-[#374151] rounded-bl-md shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 mb-2 text-[#4A7C24] font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5" /> Geotradez AI
                        </div>
                      )}
                      {msg.content}
                      <p className={cn('text-[10px] mt-2 opacity-70', msg.role === 'user' ? 'text-white/80' : 'text-[#9CA3AF]')}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ── AI Input Bar (sticky bottom) ── */}
        <div className="border-t border-[#c8dae8] bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-[#c8dae8] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
              {/* Textarea row */}
              <div className="flex items-start px-5 pt-3 pb-1.5 gap-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Geotradez AI to create anything for your business..."
                  className="flex-1 text-sm text-[#374151] placeholder:text-[#9CA3AF] resize-none focus:outline-none min-h-[40px] max-h-32 leading-relaxed bg-transparent"
                  rows={1}
                />
                <button
                  onClick={() => {
                    clearActiveAiThread();
                    setInputValue('');
                  }}
                  className="text-xs text-[#9CA3AF] hover:text-[#6B7280] flex items-center gap-1 shrink-0 mt-0.5 whitespace-nowrap"
                >
                  <span className="text-base">↺</span> Clear Chat
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 pb-3 pt-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => addToast('Attach a file from your device', 'info')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb] hover:text-[#6B7280]"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  {/* ChatGPT */}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecf4fb] border border-[#c8dae8] rounded-xl text-xs font-semibold text-[#374151] hover:bg-[#F0F7E8]">
                    <div className="w-4 h-4 rounded-full bg-[#10A37F] flex items-center justify-center shrink-0">
                      <span className="text-white text-[8px] font-extrabold">G</span>
                    </div>
                    ChatGPT <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecf4fb] border border-[#c8dae8] rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F0F7E8]">
                    <Store className="w-3.5 h-3.5 text-[#6B7280]" />
                    Product <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecf4fb] border border-[#c8dae8] rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F0F7E8]">
                    Professional <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-[#F0F7E8] border border-[#E8F5D8] flex items-center justify-center text-[#4A7C24] hover:bg-[#E8F5D8]">
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-11 h-11 rounded-xl bg-[#4A7C24] flex items-center justify-center text-white hover:bg-[#3A6B1A] disabled:opacity-40 transition-colors shadow-[0_2px_8px_rgba(74,124,36,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-5 pb-2.5 pt-0 border-t border-[#F5F8FC]">
                <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <span className="text-[#C5D3E0] text-sm">ⓘ</span>
                  Use /commands to create products, ads, store content, images, and more.
                </p>
                <button
                  onClick={() => createAiThread()}
                  className="text-xs text-[#4A7C24] font-semibold flex items-center gap-1 hover:text-[#3A6B1A]"
                >
                  <Plus className="w-3 h-3" /> New Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
