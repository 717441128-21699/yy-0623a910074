import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Store } from "@/types";
import { useProcurementStore } from "@/store/useProcurementStore";

interface Props {
  store: Store;
  index: number;
}

export default function StoreCard({ store, index }: Props) {
  const navigate = useNavigate();
  const { getStoreStats, currentRole, setCurrentStore, getDemandsByStore, currentWeek, getMaterialById } =
    useProcurementStore();

  const stats = getStoreStats(store.id);
  const demands = getDemandsByStore(store.id).filter((d) => d.week === currentWeek);

  const statusStyle = {
    未提交: "bg-slate-100 text-slate-600",
    待审: "bg-warn-100 text-warn-700",
    已审: "bg-accent-100 text-accent-700",
  };
  const statusIcon = {
    未提交: Clock,
    待审: AlertTriangle,
    已审: CheckCircle2,
  };
  const StatusIcon = statusIcon[stats.status];

  const topDemands = demands.slice(0, 2);

  return (
    <div
      className="card-hoverable p-5 cursor-pointer animate-fade-in-up group"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => {
        if (currentRole === "branch") {
          setCurrentStore(store.id);
          navigate("/submit");
        } else {
          navigate(currentRole === "hq" ? "/merge" : "/feedback");
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl ${store.badgeColor} text-white flex items-center justify-center font-serif font-bold text-lg shadow-md`}
          >
            {store.name.charAt(5)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">
              {store.name.replace("优齿口腔·", "")}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {store.city} · {store.manager}
            </p>
          </div>
        </div>
        <span
          className={`badge ${statusStyle[stats.status]} group-hover:scale-105 transition-transform`}
        >
          <StatusIcon className="w-3 h-3" />
          {stats.status}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-500 transition-all"
            style={{ width: `${Math.min(100, stats.total * 12)}%` }}
          />
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-brand-700 font-serif">
            {stats.total}
            <span className="text-xs text-slate-500 font-normal ml-0.5">项</span>
          </div>
        </div>
      </div>

      {stats.urgent > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="badge bg-danger-100 text-danger-600">
            <AlertTriangle className="w-3 h-3" />
            紧急 {stats.urgent} 项
          </span>
        </div>
      )}

      <div className="space-y-1.5 pt-3 border-t border-slate-100">
        {topDemands.length > 0 ? (
          topDemands.map((d) => {
            const mat = getMaterialById(d.materialId);
            return (
              <div
                key={d.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-600 truncate pr-2 flex-1">
                  {mat?.name ?? "未知耗材"}
                </span>
                <span
                  className={`font-medium shrink-0 ${
                    d.urgency === "critical"
                      ? "text-danger-600"
                      : d.urgency === "urgent"
                      ? "text-warn-600"
                      : "text-slate-500"
                  }`}
                >
                  {d.quantity}{mat?.unit}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 text-center py-1">本周暂无需求</p>
        )}
        {demands.length > 2 && (
          <p className="text-xs text-brand-500 text-center pt-1">
            还有 {demands.length - 2} 项...
          </p>
        )}
      </div>
    </div>
  );
}
