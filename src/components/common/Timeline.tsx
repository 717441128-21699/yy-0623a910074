import { Check, Clock, FileText, Layers, Truck, Package } from "lucide-react";
import type { DemandStatus } from "@/types";

interface Props {
  status: DemandStatus;
  expectedArrival?: string;
}

const STEPS: { key: DemandStatus; label: string; Icon: typeof FileText }[] = [
  { key: "draft", label: "已创建", Icon: FileText },
  { key: "submitted", label: "已提交", Icon: Clock },
  { key: "merged", label: "已合并", Icon: Layers },
  { key: "approved", label: "已审批", Icon: Check },
  { key: "delivering", label: "配送中", Icon: Truck },
  { key: "received", label: "已到货", Icon: Package },
];

export default function Timeline({ status, expectedArrival }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="py-2">
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.Icon;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative last:flex-none">
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-[60%] w-[80%] h-0.5 -z-10 ${
                    i < currentIdx ? "bg-accent-500" : "bg-slate-200"
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${
                  done
                    ? active
                      ? "bg-accent-500 text-white shadow-md ring-4 ring-accent-100 scale-110"
                      : "bg-accent-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-medium text-center ${
                  active ? "text-accent-700 font-bold" : done ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {expectedArrival && (currentIdx === 3 || currentIdx === 4) && (
        <p className="text-xs text-center mt-3 text-brand-600 font-medium">
          📦 预计到货：{expectedArrival}
        </p>
      )}
    </div>
  );
}
