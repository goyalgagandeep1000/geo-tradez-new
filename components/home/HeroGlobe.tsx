'use client';
import { motion } from 'framer-motion';
import {
  Shirt, Headphones, Camera, LayoutGrid,
  Users, CreditCard, BarChart3,
} from 'lucide-react';
import { GLOBE_LAND_PATHS } from '@/lib/globeLandPaths';

/* City nodes on globe — % positions on the circle */
const NODES = [
  { id: 'lon', x: 52, y: 28, size: 6 },
  { id: 'nyc', x: 28, y: 32, size: 5 },
  { id: 'dubai', x: 58, y: 42, size: 5 },
  { id: 'mumbai', x: 62, y: 48, size: 4 },
  { id: 'sa', x: 48, y: 72, size: 5 },
  { id: 'rio', x: 32, y: 62, size: 4 },
  { id: 'tokyo', x: 78, y: 36, size: 4 },
];

/* Arc connections between nodes */
const ARCS: [number, number][] = [
  [0, 1], [0, 2], [1, 5], [2, 3], [2, 4], [3, 6], [4, 5], [0, 4],
];

/** Real geographic land + white ocean globe (orthographic projection) */
function GlobeSphere() {
  const cx = 200;
  const cy = 200;
  const R = 196;

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b9f3a" />
          <stop offset="45%" stopColor="#4a7c24" />
          <stop offset="100%" stopColor="#2d5016" />
        </linearGradient>
        <radialGradient id="globeShine" cx="34%" cy="28%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="globeShadow" cx="68%" cy="78%" r="48%">
          <stop offset="0%" stopColor="#1a3a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a3a0a" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient id="globeInner" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#c8d8c0" stopOpacity="0.25" />
        </radialGradient>
        <clipPath id="globeClip">
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>

      {/* Orbital rings */}
      <ellipse cx={cx} cy={cy} rx={R + 18} ry={R * 0.38} fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.22" transform={`rotate(-22 ${cx} ${cy})`} />
      <ellipse cx={cx} cy={cy} rx={R + 10} ry={R * 0.52} fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" transform={`rotate(18 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2" />

      {/* Ocean — white sphere */}
      <circle cx={cx} cy={cy} r={R} fill="#f7fbf4" />

      <g clipPath="url(#globeClip)">
        {/* Real continent shapes */}
        {GLOBE_LAND_PATHS.map((d, i) => (
          <path
            key={`land-${i}`}
            d={d}
            fill="url(#landGrad)"
            stroke="#3d6b1a"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* 3D lighting */}
      <circle cx={cx} cy={cy} r={R} fill="url(#globeShine)" />
      <circle cx={cx} cy={cy} r={R} fill="url(#globeShadow)" />
      <circle cx={cx} cy={cy} r={R} fill="url(#globeInner)" />

      {/* Rim */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" />
      <circle cx={cx} cy={cy} r={R - 1} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

function FloatingCard({
  className,
  delay,
  children,
}: {
  className: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.2 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute bg-white/95 backdrop-blur-sm rounded-xl border border-[#c8dae8]/80 shadow-[0_8px_28px_rgba(20,40,80,0.12)] z-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function HeroGlobe() {
  const globeSize = 380;
  const cx = 280;
  const cy = 255;
  const r = globeSize / 2;

  return (
    <div className="relative w-full max-w-[580px] h-[540px] mx-auto select-none">
      {/* Connector lines from cards → globe center area */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 580 540"
        fill="none"
      >
        {/* Card connector lines only — surface arcs render on globe */}
        {[
          { x1: 95, y1: 55, x2: cx - 80, y2: cy - 60 },
          { x1: 75, y1: 230, x2: cx - 100, y2: cy },
          { x1: 100, y1: 400, x2: cx - 70, y2: cy + 80 },
          { x1: 465, y1: 70, x2: cx + 90, y2: cy - 50 },
          { x1: 480, y1: 240, x2: cx + 100, y2: cy + 10 },
          { x1: 450, y1: 390, x2: cx + 60, y2: cy + 90 },
        ].map((line, i) => (
          <line
            key={`link-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#c8e6b0"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.65"
          />
        ))}

        <defs />
      </svg>

      {/* ── Globe ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute z-[5]"
        style={{
          width: globeSize,
          height: globeSize,
          left: cx - r,
          top: cy - r,
        }}
      >
        <div className="absolute -inset-10 rounded-full bg-white/20 blur-3xl pointer-events-none" />
        <motion.div
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-6 rounded-full bg-[#8ecf5a]/15 blur-2xl pointer-events-none"
        />
        <div className="absolute -inset-4 rounded-full border border-white/30 pointer-events-none" />
        <div className="absolute -inset-1.5 rounded-full border border-white/45 pointer-events-none" />

        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_32px_80px_rgba(45,80,22,0.28),0_12px_32px_rgba(45,80,22,0.15)]">
          <GlobeSphere />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400" fill="none" aria-hidden>
            <defs>
              <clipPath id="globeSurfaceClip">
                <circle cx="200" cy="200" r="196" />
              </clipPath>
            </defs>
            <g clipPath="url(#globeSurfaceClip)">
              {ARCS.map(([a, b], i) => {
                const n1 = NODES[a];
                const n2 = NODES[b];
                const x1 = (n1.x / 100) * 400;
                const y1 = (n1.y / 100) * 400;
                const x2 = (n2.x / 100) * 400;
                const y2 = (n2.y / 100) * 400;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - 22;
                return (
                  <motion.path
                    key={`surf-arc-${i}`}
                    d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    stroke="#ffffff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Glowing city nodes */}
        {NODES.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute z-20"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.75, 1, 0.75],
              boxShadow: [
                '0 0 4px 2px rgba(255,255,255,0.8)',
                '0 0 14px 5px rgba(255,255,255,1)',
                '0 0 4px 2px rgba(255,255,255,0.8)',
              ],
            }}
            transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.2 }}
          >
            <div
              className="rounded-full bg-white border border-white/90"
              style={{ width: node.size, height: node.size }}
            />
            <div
              className="absolute inset-0 rounded-full bg-white/70 blur-[3px]"
              style={{ width: node.size, height: node.size }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Laptop (foreground, bottom-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute z-30"
        style={{ right: 20, bottom: 28, width: 220 }}
      >
        {/* Screen */}
        <div className="rounded-t-lg bg-[#1a1f2e] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#2d3656]">
          <motion.div className="rounded-md overflow-hidden bg-[#eef2f8] aspect-[16/10] relative">
            {/* Mini dashboard mockup */}
            <div className="absolute inset-0 flex">
              <div className="w-[22%] bg-[#2d5016] p-1 flex flex-col gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-sm ${i === 0 ? 'bg-white/40 w-full' : 'bg-white/15 w-3/4'}`} />
                ))}
              </div>
              <div className="flex-1 p-1.5 space-y-1">
                <div className="flex gap-1">
                  {[40, 55, 35, 60, 45].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[#5f8f12]/30" style={{ height: h * 0.35 }} />
                  ))}
                </div>
                <div className="h-8 rounded bg-white border border-[#c8dae8]/60 p-0.5">
                  <div className="h-full w-full rounded-sm bg-gradient-to-r from-[#5f8f12]/20 to-[#5f8f12]/5" />
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="h-4 rounded bg-white border border-[#c8dae8]/40" />
                  <div className="h-4 rounded bg-[#5f8f12]/15 border border-[#5f8f12]/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Base */}
        <div className="h-2 mx-3 bg-gradient-to-b from-[#c8cdd8] to-[#9aa3b5] rounded-b-md shadow-md" />
        <div className="h-1 mx-6 bg-[#8a919e] rounded-b-lg" />
      </motion.div>

      {/* ── Floating cards ── */}

      {/* Digital Products — top left */}
      <FloatingCard className="left-0 top-2 px-3 py-2.5 w-[132px]" delay={0}>
        <p className="text-[10px] font-semibold text-[#6f7893] mb-1.5">Digital Products</p>
        <div className="flex gap-1.5">
          {[
            { Icon: Shirt, bg: 'bg-blue-50 text-blue-500' },
            { Icon: Headphones, bg: 'bg-purple-50 text-purple-500' },
            { Icon: Camera, bg: 'bg-green-50 text-green-600' },
          ].map(({ Icon, bg }, i) => (
            <div key={i} className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center border border-[#c8dae8]/50`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          ))}
        </div>
      </FloatingCard>

      {/* Store Builder — top right */}
      <FloatingCard className="right-0 top-0 px-3 py-2.5 w-[118px]" delay={0.4}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-6 h-6 rounded-lg bg-[#f0f7e8] flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5 text-[#5f8f12]" />
          </div>
          <p className="text-[10px] font-bold text-[#10183f]">Store Builder</p>
        </div>
      </FloatingCard>

      {/* AI Marketing — left middle */}
      <FloatingCard className="left-[-4px] top-[38%] px-3 py-2.5 w-[120px]" delay={0.8}>
        <motion.div className="flex items-center gap-1.5 mb-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#5f8f12]" />
          <p className="text-[10px] font-bold text-[#10183f]">AI Marketing</p>
        </motion.div>
        <div className="flex items-end gap-0.5 h-7">
          {[4, 7, 5, 9, 6, 10, 8].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-[#5f8f12] to-[#7fb322]"
              style={{ height: h * 2.2 }}
            />
          ))}
        </div>
      </FloatingCard>

      {/* Global Analytics — right middle */}
      <FloatingCard className="right-[-4px] top-[36%] px-3 py-2.5 w-[128px]" delay={1.1}>
        <p className="text-[10px] font-bold text-[#10183f] mb-1">Global Analytics</p>
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e8f2fa" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#5f8f12"
                strokeWidth="4"
                strokeDasharray="66 88"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-base font-extrabold text-[#5f8f12] leading-none">+24.5%</p>
        </div>
      </FloatingCard>

      {/* Payments — bottom left */}
      <FloatingCard className="left-2 bottom-[72px] px-3 py-2.5 w-[118px]" delay={1.4}>
        <motion.div className="flex items-center gap-1.5 mb-0.5">
          <CreditCard className="w-3.5 h-3.5 text-[#5f8f12]" />
          <p className="text-[10px] font-bold text-[#10183f]">Payments</p>
        </motion.div>
        <p className="text-sm font-extrabold text-[#10183f]">$24,560</p>
        <div className="flex items-end gap-0.5 h-4 mt-1">
          {[3, 5, 4, 7, 6, 8].map((h, i) => (
            <motion.div key={i} className="flex-1 rounded-sm bg-[#5f8f12]/70" style={{ height: h * 1.5 }} />
          ))}
        </div>
      </FloatingCard>

      {/* Customer Reach — bottom right (above laptop) */}
      <FloatingCard className="right-4 bottom-[130px] px-3 py-2.5 w-[130px]" delay={1.7}>
        <motion.div className="flex items-center gap-1.5 mb-0.5">
          <Users className="w-3.5 h-3.5 text-[#6f7893]" />
          <p className="text-[10px] font-bold text-[#10183f]">Customer Reach</p>
        </motion.div>
        <p className="text-sm font-extrabold text-[#10183f] mb-1">125K+</p>
        <div className="flex -space-x-1.5">
          {[
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-5 h-5 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
      </FloatingCard>
    </div>
  );
}
