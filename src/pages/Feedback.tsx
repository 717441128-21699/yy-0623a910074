import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  PackageCheck,
  Truck,
  AlertCircle,
  Search,
  Store,
  Package,
  Clock,
} from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import { StatusBadge, UrgencyBadge, DecisionBadge } from "@/components/common/Badge";
import Timeline from "@/components/common/Timeline";
import { formatDateShort, daysFromNow, getWeekLabel } from "@/utils/date";

export default function Feedback() {
  const navigate = useNavigate();
  const {
    stores,
    currentWeek,
    currentRole,
    currentStoreId,
    setCurrentStore,
    demands,
    getStoreById,
    getMaterialById,
  } = useProcurementStore();

  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    currentRole === "hq" ? "all" : currentStoreId || "s01"
  );
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const weekDemands = useMemo(() => {
    let list = demands.filter(
      (d) => d.week === currentWeek && d.reason && d.reason.trim().length > 0
    );
    if (selectedStoreId !== "all") {
      list = list.filter((d) => d.storeId === selectedStoreId);
    }
    if (search) {
      list = list.filter((d) => {
        const m = getMaterialById(d.materialId);
        const s = getStoreById(d.storeId);
        return (
          m?.name.includes(search) ||
          m?.spec.includes(search) ||
          s?.name.includes(search) ||
          d.reason.includes(search)
        );
      });
    }
    return list.sort((a, b) => {
      const urgScore = { critical: 0, urgent: 1, normal: 2 };
      return urgScore[a.urgency] - urgScore[b.urgency];
    });
  }, [demands, currentWeek, selectedStoreId, search, getMaterialById, getStoreById]);

  const delivering = weekDemands.filter((d) => d.expectedArrival);
  const arrivingSoon = delivering.filter((d) => {
    const dfn = daysFromNow(d.expectedArrival);
    return dfn !== null && dfn >= 0 && dfn <= 2;
  });

  const storeOptions =
    currentRole === "hq"
      ? [{ id: "all", name: "全部门店" }, ...stores.map((s) => ({ id: s.id, name: s.name }))]
      : stores.filter((s) => s.id === currentStoreId).map((s) => ({ id: s.id, name: s.name }));

  const selectedStore = selectedStoreId === "all" ? null : getStoreById(selectedStoreId);

  const stats = useMemo(() => {
    const total = weekDemands.length;
    const draft = weekDemands.filter((d) => d.status === "draft").length;
    const inProcess = weekDemands.filter(
      (d) => d.status === "submitted" || d.status === "merged" || d.status === "approved"
    ).length;
    const deliveringC = weekDemands.filter((d) => d.status === "delivering").length;
    const received = weekDemands.filter((d) => d.status === "received").length;
    return { total, draft, inProcess, deliveringC, received };
  }, [weekDemands]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="page-title">
              {currentRole === "hq" ? "全部门店到货反馈" : "本院到货反馈跟踪"}
            </h1>
            <p className="page-subtitle">
              {getWeekLabel(currentWeek)} · 审批状态、预计到货、配送进度全程透明
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索耗材、门店..."
                className="input-sm pl-9 w-64"
              />
            </div>
            {currentRole === "hq" && (
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="input-sm w-56"
              >
                {storeOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name.replace("优齿口腔·", "")}
                  </option>
                ))}
              </select>
            )}
            {currentRole === "branch" && (
              <button onClick={() => navigate("/submit")} className="btn-primary">
                去提交需求
              </button>
            )}
          </div>
        </div>
      </div>

      {arrivingSoon.length > 0 && (
        <div className="card p-5 bg-gradient-to-r from-accent-50 via-white to-brand-50 border-2 border-accent-200 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-accent-200/60 animate-pulse">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                今日 / 明日 到货提醒
                <span className="badge bg-accent-500 text-white">{arrivingSoon.length} 项</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {arrivingSoon.slice(0, 6).map((d) => {
                  const m = getMaterialById(d.materialId);
                  const s = getStoreById(d.storeId);
                  const dfn = daysFromNow(d.expectedArrival);
                  return (
                    <div
                      key={d.id}
                      className="px-3 py-2 rounded-xl bg-white border border-accent-100 text-sm flex items-center gap-2 hover:border-accent-300 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(d.id)}
                    >
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                          dfn === 0 ? "bg-accent-500 text-white" : "bg-warn-100 text-warn-700"
                        }`}
                      >
                        {dfn === 0 ? "今日" : dfn === 1 ? "明日" : `${dfn}天内`}
                      </span>
                      <span className="font-medium text-slate-800">{m?.name}</span>
                      <span className="text-xs text-slate-500">
                        {s?.name.replace("优齿口腔·", "").slice(0, 8)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "需求总数",
            value: stats.total,
            unit: "项",
            Icon: Package,
            color: "from-brand-500 to-brand-700",
          },
          {
            label: "草稿中",
            value: stats.draft,
            unit: "项",
            Icon: Clock,
            color: "from-slate-500 to-slate-700",
          },
          {
            label: "审批合单中",
            value: stats.inProcess,
            unit: "项",
            Icon: PackageCheck,
            color: "from-brand-400 to-violet-500",
          },
          {
            label: "配送中",
            value: stats.deliveringC,
            unit: "项",
            Icon: Truck,
            color: "from-sky-500 to-sky-700",
          },
          {
            label: "已到货",
            value: stats.received,
            unit: "项",
            Icon: PackageCheck,
            color: "from-accent-500 to-accent-700",
          },
        ].map((s, i) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.label}
              className={`card p-5 text-white bg-gradient-to-br ${s.color} shadow-card animate-fade-in-up`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
                  {s.label}
                </span>
                <Icon className="w-5 h-5 text-white/80" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-bold">{s.value}</span>
                <span className="text-sm text-white/70">{s.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {currentRole === "hq" && (
        <div className="card p-5">
          <h3 className="font-serif text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-600" />
            各门店本周进度一览
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stores.map((s) => {
              const sDemands = demands.filter(
                (d) => d.week === currentWeek && d.storeId === s.id
              );
              const arrivedC = sDemands.filter(
                (d) => d.status === "delivering" || d.status === "received"
              ).length;
              const pct = sDemands.length > 0 ? Math.round((arrivedC / sDemands.length) * 100) : 0;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStoreId(s.id);
                    setCurrentStore(s.id);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedStoreId === s.id
                      ? "bg-brand-50 border-brand-300 shadow-md"
                      : "bg-white border-slate-100 hover:border-brand-200 hover:shadow"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg ${s.badgeColor} text-white flex items-center justify-center text-xs font-bold`}
                    >
                      {s.name.charAt(5)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {s.name.replace("优齿口腔·", "")}
                      </div>
                      <div className="text-[11px] text-slate-500">{s.city}</div>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs text-slate-500">进度</span>
                    <span className="text-sm font-bold text-brand-700">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-accent-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>需求 {sDemands.length}</span>
                    <span>配送 {arrivedC}</span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedStoreId("all")}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                selectedStoreId === "all"
                  ? "bg-brand-50 border-brand-300 shadow-md"
                  : "bg-white border-dashed border-slate-200 hover:border-brand-300"
              }`}
            >
              <Store className="w-6 h-6 text-brand-600" />
              <span className="text-sm font-semibold text-slate-700">显示全部门店</span>
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-serif text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-600" />
            需求明细与状态跟踪
            {selectedStore && (
              <span className="text-sm font-normal text-slate-500">
                · {selectedStore.name.replace("优齿口腔·", "")}
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-500">共 {weekDemands.length} 条</span>
        </div>

        {weekDemands.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-2">
              暂无符合条件的需求
            </h2>
            <p className="text-slate-500 mb-6">
              当前筛选条件下没有需求记录，尝试调整门店或搜索条件
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {weekDemands.map((d, i) => {
              const m = getMaterialById(d.materialId);
              const s = getStoreById(d.storeId);
              const expanded = expandedId === d.id;
              const dfn = daysFromNow(d.expectedArrival);
              return (
                <div
                  key={d.id}
                  className={`hover:bg-slate-50/50 transition-colors animate-fade-in`}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : d.id)}
                    className="w-full p-5 grid grid-cols-12 gap-4 items-center text-left"
                  >
                    <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center shrink-0`}
                      >
                        <Package className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 truncate">{m?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{m?.spec}</div>
                      </div>
                    </div>
                    {currentRole === "hq" && (
                      <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                        {s && (
                          <div
                            className={`w-7 h-7 rounded-full ${s.badgeColor} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}
                          >
                            {s.name.charAt(5)}
                          </div>
                        )}
                        <span className="text-sm text-slate-700 truncate">
                          {s?.name.replace("优齿口腔·", "")}
                        </span>
                      </div>
                    )}
                    <div className="col-span-4 md:col-span-2 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-brand-700">
                        {d.quantity}
                        {m?.unit}
                      </span>
                      <UrgencyBadge urgency={d.urgency} />
                    </div>
                    <div className="col-span-4 md:col-span-2 flex items-center gap-2 flex-wrap">
                      <StatusBadge status={d.status} />
                      {d.decision && d.decision !== "pending" && (
                        <DecisionBadge decision={d.decision} />
                      )}
                      {d.decision === "hold" && (
                        <span className="text-[10px] badge bg-slate-200 text-slate-600 ml-1">
                          采购暂缓
                        </span>
                      )}
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right md:text-left">
                      {d.expectedArrival ? (
                        <div>
                          <div
                            className={`text-sm font-bold ${
                              dfn !== null && dfn <= 1
                                ? "text-accent-600"
                                : dfn !== null && dfn < 0
                                ? "text-slate-400"
                                : "text-brand-700"
                            }`}
                          >
                            {formatDateShort(d.expectedArrival)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {dfn === null
                              ? ""
                              : dfn < 0
                              ? `已逾期 ${-dfn} 天`
                              : dfn === 0
                              ? "今日到货 🎉"
                              : `还有 ${dfn} 天`}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">预计到货待确定</div>
                      )}
                    </div>
                    <div className="hidden md:block col-span-1">
                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 ml-auto transition-transform ${
                          expanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expanded && (
                    <div className="px-5 pb-5 pt-0 animate-fade-in">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">申请理由</div>
                            <div className="text-sm text-slate-700">{d.reason || "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">创建周次</div>
                            <div className="text-sm text-slate-700">{getWeekLabel(d.week)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">所属门店</div>
                            <div className="text-sm text-slate-700">
                              {s?.name} · 负责人 {s?.manager}
                            </div>
                          </div>
                        </div>
                        <Timeline status={d.status} expectedArrival={d.expectedArrival} decision={d.decision} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
