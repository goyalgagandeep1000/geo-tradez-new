'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, CreditCard, Download, FileText, ChevronDown,
  TrendingUp, Calendar, Clock, Shield, Zap, DollarSign,
  CheckCircle2, MoreHorizontal, Building2, Eye, EyeOff, Filter
} from 'lucide-react';
// Note: walletLinks moved to Sidebar.tsx
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

const quickAmounts = [100, 250, 500];

const paymentMethods = [
  { id: 'bank', label: 'Bank Account', sub: 'James Carter\nSaving Account', mask: '•••• •••• •••• 4587', primary: true, icon: '🏦' },
  { id: 'paypal', label: 'PayPal', sub: 'James Carter\nPayPal Account', mask: 'james.carter@email.com', primary: false, icon: 'P' },
  { id: 'wise', label: 'Wise', sub: 'James Carter\nWise Account', mask: 'james.carter@wise.com', primary: false, icon: 'W' },
];

const trustBadges = [
  { icon: Shield, label: 'Secure Transfers', sub: 'Your money is 100% secure' },
  { icon: Zap, label: 'Fast Payouts', sub: 'Withdraw in 24-48 hours' },
  { icon: DollarSign, label: 'Low Fees', sub: 'Competitive withdrawal fees' },
  { icon: Clock, label: '24/7 Support', sub: "We're here to help you" },
];

export default function WalletPage() {
  const [amount, setAmount] = useState('520');
  const [selectedQuick, setSelectedQuick] = useState(500);
  const [payoutMethod, setPayoutMethod] = useState('Bank');
  const {
    walletBalance,
    balanceHidden,
    toggleBalanceHidden,
    transactions,
    withdrawFunds,
    openModal,
    addToast,
  } = useAppStore();

  const showBalance = !balanceHidden;

  const fee = parseFloat(amount || '0') * 0.02;
  const receive = parseFloat(amount || '0') - fee;

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    withdrawFunds(amt, payoutMethod);
  };

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1A1F2E] flex items-center gap-2" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                Wallet Overview <span className="text-[#4A7C24]">✦</span>
              </h1>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Manage your earnings, withdrawals, and payout preferences.</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Available Balance toggle */}
              <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#c8dae8] rounded-xl text-sm text-[#374151] hover:bg-[#ecf4fb] shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-medium">
                Available Balance
                <span onClick={toggleBalanceHidden} className="cursor-pointer">
                  {showBalance ? <Eye className="w-4 h-4 text-[#6B7280]" /> : <EyeOff className="w-4 h-4 text-[#6B7280]" />}
                </span>
              </button>
              <button
                onClick={() => openModal('withdraw')}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A7C24] text-white text-sm font-semibold rounded-xl hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.3)]"
              >
                <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
              </button>
              <button
                onClick={() => addToast('Statement downloaded (demo)', 'info')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c8dae8] text-sm text-[#374151] rounded-xl hover:bg-[#ecf4fb] font-medium"
              >
                <Download className="w-4 h-4" /> Download Statement
              </button>
            </div>
          </div>

          {/* Wallet Card + 4 Stats — single horizontal row */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {/* Dark Wallet Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 text-white relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.2)] shrink-0 w-72"
              style={{ background: 'linear-gradient(135deg, #1A3A08 0%, #0D2B45 60%, #071520 100%)' }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-4 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full border border-[#4A7C24] bg-[#4A7C24] flex items-center justify-center">
                      <span className="text-white font-extrabold text-[11px]">G</span>
                    </div>
                    <p className="text-xs font-bold text-white">Geotradez Wallet</p>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                    <span className="text-white font-extrabold text-base" style={{ fontFamily: 'Sora' }}>G</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[10px] text-white/50 mb-1">Available Balance</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-extrabold text-white">
                      {showBalance ? '$2,458.30' : '••••••••'}
                    </p>
                    <span className="text-[10px] text-white/50 font-medium px-1.5 py-0.5 border border-white/20 rounded-md">USD</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Account Holder', val: 'James Carter' },
                      { label: 'Account Type',   val: 'Pro Seller' },
                      { label: 'Account No.',    val: '•••• 4587' },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-[10px] font-semibold text-white leading-tight">{val}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mastercard */}
                  <div className="flex items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-red-500/80 -mr-2.5 border border-white/10" />
                    <div className="w-6 h-6 rounded-full bg-amber-400/80 border border-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4 Stat cards — each as a vertical card, all in one row */}
            {[
              { label: 'Total Withdrawn',      value: '$24,685.90', change: '↑ 19.6% vs last month', icon: DollarSign, iconBg: 'bg-blue-50',   iconColor: 'text-blue-600'   },
              { label: 'Pending Withdrawal',   value: '$3,245.20',  change: '↑ 14.2% vs last month', icon: Clock,       iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
              { label: 'This Month Withdrawn', value: '$2,140.60',  change: '↑ 12.8% vs last month', icon: TrendingUp,  iconBg: 'bg-green-50',  iconColor: 'text-green-600'  },
              { label: 'Next Payout Date',     value: 'May 28, 2024', change: '3 days remaining',    icon: Calendar,    iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-white rounded-xl border border-[#c8dae8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex-1 min-w-[160px] shrink-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', stat.iconBg)}>
                    <stat.icon className={cn('w-4 h-4', stat.iconColor)} />
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-medium leading-tight">{stat.label}</span>
                </div>
                <p className="text-xl font-extrabold text-[#1A1F2E] mb-0.5">{stat.value}</p>
                <p className="text-xs text-green-600 font-semibold">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges with subtitles */}
          <div className="bg-white rounded-xl border border-[#c8dae8] px-5 py-3 flex items-center gap-0 divide-x divide-[#F1F5F9]">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2.5 px-5 first:pl-0 last:pr-0 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#F0F7E8] flex items-center justify-center">
                  <b.icon className="w-4 h-4 text-[#4A7C24]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#374151]">{b.label}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-[#c8dae8] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between p-4 border-b border-[#dce8f2]">
              <h3 className="text-sm font-bold text-[#1A1F2E] flex items-center gap-2">
                Withdrawal History <span className="text-[#4A7C24]">✦</span>
              </h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-[#c8dae8] rounded-lg text-xs text-[#6B7280] hover:bg-[#ecf4fb] font-medium">
                  All Transactions <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-[#c8dae8] rounded-lg text-xs text-[#6B7280] hover:bg-[#ecf4fb] font-medium">
                  May 1, 2024 – May 24, 2024 📅
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-[#c8dae8] rounded-lg text-xs text-[#6B7280] hover:bg-[#ecf4fb] font-medium">
                  <Filter className="w-3 h-3" /> Filters
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5faff] text-left">
                    {['Date', 'Description', 'Type', 'Amount', 'Status', 'Balance', ''].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-t border-[#F5F8FC] hover:bg-[#f5faff] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-[#374151]">{tx.date}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{tx.time}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-[#374151]">{tx.description}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{tx.accountMask}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md bg-[#ecf4fb] border border-[#c8dae8] flex items-center justify-center text-xs font-bold">
                            {tx.paymentMethod === 'Bank' ? <Building2 className="w-3 h-3 text-[#6B7280]" /> :
                             tx.paymentMethod === 'PayPal' ? <span className="text-blue-600">P</span> :
                             <span className="text-[#37B97D]">W</span>}
                          </div>
                          <span className="text-xs text-[#374151] font-medium">{tx.paymentMethod}</span>
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">Withdrawal</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-red-500">-${Math.abs(tx.amount).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#374151]">${tx.balance.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[#C5D3E0] hover:text-[#6B7280]">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#dce8f2]">
              <span className="text-xs text-[#9CA3AF]">Showing 1 to 5 of 5 transactions</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-md border border-[#c8dae8] text-xs text-[#6B7280] hover:bg-[#ecf4fb] flex items-center justify-center">‹</button>
                <button className="w-7 h-7 rounded-md bg-[#4A7C24] text-xs text-white flex items-center justify-center font-semibold">1</button>
                <button className="w-7 h-7 rounded-md border border-[#c8dae8] text-xs text-[#6B7280] hover:bg-[#ecf4fb] flex items-center justify-center">›</button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1A1F2E] flex items-center gap-2">
                Payment Methods <span className="text-[#4A7C24]">✦</span>
              </h3>
              <button className="text-xs text-[#4A7C24] font-semibold border border-[#c8dae8] rounded-lg px-3 py-1.5 hover:bg-[#F0F7E8]">
                Manage Methods
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer',
                    pm.primary ? 'border-[#4A7C24]/30 bg-[#F9FCF7]' : 'border-[#c8dae8] hover:border-[#4A7C24]/30'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#c8dae8] flex items-center justify-center text-lg shadow-sm shrink-0">
                    {pm.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#374151]">{pm.label} {pm.mask}</p>
                      {pm.primary && <span className="text-[9px] font-bold text-[#4A7C24] bg-[#F0F7E8] px-1.5 py-0.5 rounded-md">PRIMARY</span>}
                    </div>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5 whitespace-pre-line leading-tight">{pm.sub}</p>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#c8dae8] text-sm text-[#9CA3AF] hover:border-[#4A7C24] hover:text-[#4A7C24] transition-all font-medium">
                <span className="text-lg">+</span> Add New Method
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Panel (right) */}
      <aside className="hidden xl:flex w-64 shrink-0 flex-col bg-[#f5faff] border-l border-[#c8dae8] p-4 space-y-4 overflow-y-auto">
        <h3 className="text-sm font-bold text-[#1A1F2E] flex items-center gap-2">
          Withdraw Funds <span className="text-[#4A7C24]">✦</span>
        </h3>
        <div className="bg-[#F0F7E8] rounded-xl p-3 border border-[#E8F5D8]">
          <p className="text-xs text-[#6B7280] mb-0.5">Available Balance</p>
          <p className="text-lg font-extrabold text-[#1A1F2E]">
            {showBalance ? `$${walletBalance.toFixed(2)}` : '••••••'} <span className="text-xs font-normal text-[#9CA3AF]">USD</span>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#374151] mb-1.5">Payout Method</p>
          <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-[#c8dae8] rounded-xl text-sm text-[#374151] hover:border-[#4A7C24]">
            <Building2 className="w-4 h-4 text-[#6B7280]" />
            <span className="flex-1 text-left text-xs font-medium">Bank Account •••• 4587</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-[#374151]">Enter Amount</p>
            <span className="text-xs text-[#9CA3AF]">USD</span>
          </div>
          <div className="flex items-center bg-white border border-[#c8dae8] rounded-xl px-3 py-2.5 focus-within:border-[#4A7C24]">
            <span className="text-base text-[#9CA3AF] mr-1">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-xl font-extrabold text-[#1A1F2E] bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="grid grid-cols-4 gap-1.5">
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => { setSelectedQuick(a); setAmount(String(a)); }}
              className={cn(
                'py-2 rounded-xl text-xs font-bold transition-all',
                selectedQuick === a
                  ? 'bg-[#4A7C24] text-white shadow-sm'
                  : 'bg-[#ecf4fb] border border-[#c8dae8] text-[#374151] hover:border-[#4A7C24]'
              )}
            >
              ${a}
            </button>
          ))}
          <button
            onClick={() => {
              setAmount(String(Math.floor(walletBalance)));
              setSelectedQuick(-1);
            }}
            className="py-2 rounded-xl text-xs font-bold bg-[#ecf4fb] border border-[#c8dae8] text-[#374151] hover:border-[#4A7C24]"
          >
            Max
          </button>
        </div>

        {/* Fee breakdown */}
        <div className="space-y-2 text-xs bg-[#f5faff] rounded-xl p-3 border border-[#dce8f2]">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span>Withdrawal Fee (2%)</span>
            <span>-${fee.toFixed(2)} USD</span>
          </div>
          <div className="flex items-center justify-between font-bold border-t border-[#dce8f2] pt-2">
            <span className="text-[#374151]">You Will Receive</span>
            <span className="text-[#4A7C24] text-sm">${receive.toFixed(2)} USD</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleWithdraw}
          className="w-full py-3 bg-[#4A7C24] text-white text-sm font-bold rounded-xl hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.3)] transition-all"
        >
          Withdraw Now
        </motion.button>
        <p className="text-[10px] text-[#9CA3AF] text-center flex items-center justify-center gap-1">
          🔒 Minimum withdrawal: $10.00
        </p>

        <div className="h-px bg-[#F1F5F9]" />

        {/* Payout Insights */}
        <div>
          <h4 className="text-xs font-bold text-[#374151] flex items-center gap-1.5 mb-3">
            <span className="text-[#4A7C24]">✦</span> Payout Insights
          </h4>
          <div className="space-y-2.5">
            {[
              { icon: Calendar, label: 'Next Payout', val: 'May 28, 2024', sub: '3 days remaining' },
              { icon: TrendingUp, label: 'Monthly Withdrawn', val: '$2,140.60', sub: '↑ 12.8% vs last month' },
              { icon: Clock, label: 'Avg. Processing Time', val: '24–48 hours', sub: 'After request' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0F7E8] flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-[#4A7C24]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9CA3AF]">{item.label}</p>
                  <p className="text-xs font-bold text-[#374151]">{item.val}</p>
                  {item.sub && <p className="text-[10px] text-[#9CA3AF]">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#F1F5F9]" />

        {/* Wallet Health */}
        <div>
          <h4 className="text-xs font-bold text-[#374151] flex items-center gap-1.5 mb-3">
            <span className="text-[#4A7C24]">✦</span> Store Wallet Health
          </h4>
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#F0F7E8" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#22C55E" strokeWidth="7"
                  strokeDasharray="213.6 213.6" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-extrabold text-[#1A1F2E]">100%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center font-bold text-green-600 mb-2">Excellent</p>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-2.5 border border-green-100">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            <p className="text-[10px] text-green-700 font-medium">Your wallet is in great standing. All Good ✓</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
