import type { Urgency, DemandStatus, Decision } from "@/types";
import { AlertTriangle, AlertCircle, Info, Clock, FileText, Layers, CheckCheck, Truck, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config: Record<Urgency, { cls: string; label: string; Icon: LucideIcon }> = {
    normal: { cls: "bg-slate-100 text-slate-600", label: "常规", Icon: Info },
    urgent: { cls: "bg-warn-100 text-warn-700", label: "紧急", Icon: AlertTriangle },
    critical: { cls: "bg-danger-100 text-danger-600", label: "特急", Icon: AlertCircle },
  };
  const { cls, label, Icon } = config[urgency];
  return (
    <span className={`badge ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: DemandStatus }) {
  const config: Record<DemandStatus, { cls: string; label: string; Icon: LucideIcon }> = {
    draft: { cls: "bg-slate-100 text-slate-500", label: "草稿", Icon: FileText },
    submitted: { cls: "bg-brand-100 text-brand-700", label: "已提交", Icon: Clock },
    merged: { cls: "bg-violet-100 text-violet-700", label: "已合并", Icon: Layers },
    approved: { cls: "bg-accent-100 text-accent-700", label: "已审批", Icon: CheckCheck },
    delivering: { cls: "bg-sky-100 text-sky-700", label: "配送中", Icon: Truck },
    received: { cls: "bg-emerald-100 text-emerald-700", label: "已到货", Icon: Package },
  };
  const { cls, label, Icon } = config[status];
  return (
    <span className={`badge ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export function DecisionBadge({ decision }: { decision: Decision }) {
  const config: Record<Decision, { cls: string; label: string }> = {
    pending: { cls: "bg-slate-100 text-slate-600", label: "待决策" },
    order_now: { cls: "bg-accent-100 text-accent-700", label: "立即订" },
    next_week: { cls: "bg-brand-100 text-brand-700", label: "下周合单" },
    hold: { cls: "bg-slate-200 text-slate-600", label: "暂缓" },
  };
  const { cls, label } = config[decision];
  return <span className={`badge ${cls}`}>{label}</span>;
}
