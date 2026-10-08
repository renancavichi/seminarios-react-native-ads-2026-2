import { ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/80 backdrop-blur-sm">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-slate-400 font-mono ml-2">{title}</span>
          <span className="ml-auto text-[10px] text-slate-500 uppercase tracking-wider">{language}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-md">
        <code className="text-slate-300 font-mono leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
  rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
};

export function FeatureCard({ icon, title, description, color = 'indigo' }: FeatureCardProps) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorMap[color]}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-md text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

interface SlideWrapperProps {
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl';
}

export function SlideWrapper({ children, maxWidth = 'xl' }: SlideWrapperProps) {
  const maxWidthClass = {
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
  };

  return (
    <div className={`w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12`}>
      {children}
    </div>
  );
}

interface SlideTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export function SlideTitle({ badge, title, subtitle }: SlideTitleProps) {
  return (
    <div className="mb-8 sm:mb-12">
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 animate-fade-in-delay-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-center text-slate-400 animate-fade-in-delay-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  highlightCol?: number;
}

export function ComparisonTable({ headers, rows, highlightCol }: ComparisonTableProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider ${
                    highlightCol === i ? 'text-indigo-300' : 'text-slate-400'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3 ${
                      highlightCol === cellIdx
                        ? 'text-indigo-300 font-medium'
                        : 'text-slate-300'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber';
}

const statColorMap = {
  indigo: 'text-indigo-400',
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

export function StatCard({ value, label, color = 'indigo' }: StatCardProps) {
  return (
    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
      <div className={`text-2xl sm:text-3xl font-bold ${statColorMap[color]} mb-1`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
