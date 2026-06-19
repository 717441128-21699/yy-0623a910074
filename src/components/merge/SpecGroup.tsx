import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Store, Package2 } from "lucide-react";
import type { Demand, Material, MergedOrder } from "@/types";
import { useProcurementStore } from "@/store/useProcurementStore";
import { UrgencyBadge, StatusBadge } from "@/components/common/Badge";
import { formatDateShort } from "@/utils/date";

interface Props {
  material: Material;
  demands: Demand[];
  mergedOrder?: MergedOrder;
  onCompare?: () => void;
  onMerge?: () => void;
}

export default function SpecGroup({ material, demands, mergedOrder, onCompare, onMerge }: Props) {
  const [open, setOpen] = useState(true);
  const { getStoreById } = useProcurementStore();

  const totalQty = demands.reduce((s, d) => s + d.quantity, 0);
  const urgentCount = demands.filter(
    (d) => d.urgency === "urgent" || d.urgency === "critical"
  ).length;
  const storeCount = new Set(demands.map((d) => d.storeId)).size;

  return (
    <div className="card mb-4 overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center shrink-0">
          <Package2 className="w-6 h-6 text-brand-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-serif text-lg font-semibold text-slate-800">
              {material.name}
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {material.category}
            </span>
          </div>
          <p className="text-sm text-slate-500">规格：{material.spec}</p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-center">
            <div className="font-serif text-2xl font-bold text-brand-600">{totalQty}</div>
            <div className="text-[11px] text-slate-500">总需求{material.unit}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center font-semibold text-slate-700">
              <Store className="w-4 h-4 text-slate-400" />
              {storeCount}
            </div>
            <div className="text-[11px] text-slate-500">申请门店</div>
          </div>
          {urgentCount > 0 && (
            <div className="text-center">
              <div className="font-bold text-danger-600">{urgentCount}</div>
              <div className="text-[11px] text-danger-500">紧急</div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {mergedOrder ? (
              <span className="badge bg-accent-50 text-accent-700 border border-accent-200">
                <Layers className="w-3 h-3" />
                已合并 #{mergedOrder.id}
              </span>
            ) : (
              onMerge && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMerge();
                  }}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Layers className="w-3.5 h-3.5" />
                  立即合并
                </button>
              )
            )}
            {onCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
                className="btn-outline text-xs py-1.5 px-3"
              >
                供应商比价
              </button>
            )}
          </div>
          {open ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/30 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {demands.map((d) => {
              const store = getStoreById(d.storeId);
              return (
                <div
                  key={d.id}
                  className="bg-white rounded-xl p-3 border border-slate-100 hover:border-brand-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {store && (
                        <div
                          className={`w-7 h-7 rounded-full ${store.badgeColor} text-white flex items-center justify-center text-[11px] font-bold`}
                        >
                          {store.name.charAt(5)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-800">
                        {store?.name.replace("优齿口腔·", "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={d.status} />
                      <UrgencyBadge urgency={d.urgency} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">申请数量</p>
                      <p className="text-sm font-bold text-brand-700">
                        {d.quantity} {material.unit}
                      </p>
                    </div>
                    <div className="text-right max-w-[55%]">
                      <p className="text-xs text-slate-500 mb-0.5">理由</p>
                      <p className="text-xs text-slate-700 line-clamp-2">{d.reason}</p>
                    </div>
                  </div>
                  {d.expectedArrival && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-accent-700 flex items-center gap-1">
                      📦 预计 {formatDateShort(d.expectedArrival)} 到货
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
