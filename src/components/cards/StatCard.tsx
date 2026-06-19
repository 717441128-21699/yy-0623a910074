import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  gradient: string;
  iconBg: string;
  delay?: number;
  children?: ReactNode;
}

export default function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  gradient,
  iconBg,
  delay = 0,
  children,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-card hover:shadow-card-hover transition-all duration-500 -translate-y-0 hover:-translate-y-1 animate-fade-in-up`}
      style={{
        background: gradient,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs text-white/70 tracking-wide font-medium uppercase">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-serif font-bold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-white/75 font-medium">{unit}</span>}
          </div>
          {trend && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                trend.value > 0
                  ? "bg-white/20 text-white"
                  : "bg-white/15 text-white/80"
              }`}
            >
              {trend.value > 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} backdrop-blur-sm shadow-inner`}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
      </div>
      {children}
    </div>
  );
}
