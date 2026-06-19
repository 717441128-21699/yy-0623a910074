import { Check, Clock, FileText, Layers, Truck, Package, Pause, CalendarDays, Zap } from "lucide-react";
import type { DemandStatus, Decision } from "@/types";

interface Props {
  status: DemandStatus;
  expectedArrival?: string;
  decision?: Decision;
}

const BASE_STEPS: { key: DemandStatus; label: string; Icon: typeof FileText }[] = [
  { key: "draft", label: "已创建", Icon: FileText },
  { key: "submitted", label: "已提交", Icon: Clock },
  { key: "merged", label: "已合并", Icon: Layers },
  { key: "approved", label: "已审批", Icon: Check },
  { key: "delivering", label: "配送中", Icon: Truck },
  { key: "received", label: "已到货", Icon: Package },
];

export default function Timeline({ status, expectedArrival, decision }: Props) {
  const decisionMeta: Record<string, { label: string; Icon: typeof FileText; cls: string; activeCls: string; textCls: string }> = {
    order_now: { label: "已确认·立即订", Icon: Zap, cls: "bg-accent-500", activeCls: "bg-accent-500 text-white shadow-md ring-4 ring-accent-100 scale-110", textCls: "text-accent-700" },
    next_week: { label: "已安排·下周合单", Icon: CalendarDays, cls: "bg-sky-500", activeCls: "bg-sky-500 text-white shadow-md ring-4 ring-sky-100 scale-110", textCls: "text-sky-700" },
    hold: { label: "已暂缓", Icon: Pause, cls: "bg-slate-400", activeCls: "bg-slate-500 text-white shadow-md ring-4 ring-slate-200 scale-110", textCls: "text-slate-700" },
    pending: { label: "待审批", Icon: Clock, cls: "bg-brand-500", activeCls: "bg-brand-500 text-white shadow-md ring-4 ring-brand-100 scale-110", textCls: "text-brand-700" },
  };

  const steps = BASE_STEPS.map((s) => {
    if (s.key === "approved" && decision && decision !== "pending") {
      const dm = decisionMeta[decision] ?? decisionMeta.pending;
      return { ...s, label: dm.label, Icon: dm.Icon, meta: dm };
    }
    return s;
  });

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="py-2">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const isDecisionStep = step.key === "approved";
          const dm = (step as any).meta as typeof decisionMeta[string] | undefined;
          const Icon = step.Icon;

          const bgCls = done
            ? isDecisionStep && dm
              ? dm.cls
              : "bg-accent-500"
            : "bg-slate-100";
          const activeCls = done
            ? active
              ? isDecisionStep && dm
                ? dm.activeCls
                : "bg-accent-500 text-white shadow-md ring-4 ring-accent-100 scale-110"
              : isDecisionStep && dm
              ? `${dm.cls} text-white`
              : "bg-accent-500 text-white"
            : "bg-slate-100 text-slate-400";
          const lineCls = i < currentIdx
            ? isDecisionStep && dm
              ? dm.cls
              : "bg-accent-500"
            : "bg-slate-200";
          const textCls = active
            ? isDecisionStep && dm
              ? dm.textCls
              : "text-accent-700 font-bold"
            : done
            ? "text-slate-600"
            : "text-slate-400";

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative last:flex-none">
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[60%] w-[80%] h-0.5 -z-10 ${lineCls}`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${active ? activeCls : `${bgCls} ${done ? "text-white" : "text-slate-400"}`}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-medium text-center ${textCls} ${active ? "font-bold" : ""}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {expectedArrival && (currentIdx === 3 || currentIdx === 4 || currentIdx === 5) && (
        <p className="text-xs text-center mt-3 text-brand-600 font-medium">
          📦 预计到货：{expectedArrival}
        </p>
      )}
      {decision === "hold" && (
        <p className="text-xs text-center mt-3 text-slate-500">
          ⏸ 已由采购主管暂缓处理，如有急需请联系总部
        </p>
      )}
    </div>
  );
}
