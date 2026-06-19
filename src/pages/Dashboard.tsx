import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Filter,
  Search,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import StatCard from "@/components/cards/StatCard";
import StoreCard from "@/components/cards/StoreCard";
import { UrgencyBadge, StatusBadge } from "@/components/common/Badge";
import { getWeekLabel, formatDateShort, daysFromNow } from "@/utils/date";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    stores,
    currentWeek,
    currentRole,
    getStats,
    getUrgentDemands,
    getMaterialById,
    getStoreById,
    mergedOrders,
    demands,
    getDemandsByStore,
    currentStoreId,
  } = useProcurementStore();

  const stats = getStats();
  const urgentDemands = getUrgentDemands().filter((d) => d.week === currentWeek);
  const deliveringOrders = mergedOrders.filter((o) => o.decision === "order_now");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">
              {currentRole === "hq" ? "采购总览看板" : "本院需求总览"}
            </h1>
            <p className="page-subtitle">
              {getWeekLabel(currentWeek)} · 各门店本周需求提交与审批状态
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="搜索门店、耗材..."
                className="input pl-9 w-64"
              />
            </div>
            <button className="btn-outline">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="本周需求总数"
          value={stats.total}
          unit="项"
          icon={LayoutDashboard}
          trend={{ value: 12, label: "环比上周" }}
          gradient="linear-gradient(135deg,#1e3a5f 0%,#4d88c9 100%)"
          iconBg="bg-white/20"
          delay={0}
        />
        <StatCard
          label="待审批合并"
          value={stats.pending}
          unit="项"
          icon={Clock}
          trend={{ value: -8, label: "较上周" }}
          gradient="linear-gradient(135deg,#d97706 0%,#f59e0b 100%)"
          iconBg="bg-white/20"
          delay={50}
        />
        <StatCard
          label="合单处理中"
          value={stats.merged}
          unit="单"
          icon={Layers}
          gradient="linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)"
          iconBg="bg-white/20"
          delay={100}
        />
        <StatCard
          label="已下单配送"
          value={stats.ordered}
          unit="单"
          icon={CheckCircle2}
          trend={{ value: 25, label: "效率提升" }}
          gradient="linear-gradient(135deg,#047857 0%,#10b981 100%)"
          iconBg="bg-white/20"
          delay={150}
        />
        <StatCard
          label="采购金额预估"
          value={`¥${(stats.estimatedCost / 10000).toFixed(1)}`}
          unit="万"
          icon={Wallet}
          trend={{ value: -5, label: "合单节省" }}
          gradient="linear-gradient(135deg,#be123c 0%,#f43f5e 100%)"
          iconBg="bg-white/20"
          delay={200}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-brand-500" />
              {currentRole === "hq" ? "各门店需求状态" : "门店列表"}
            </h2>
            <button
              onClick={() => navigate(currentRole === "hq" ? "/merge" : "/submit")}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentRole === "hq"
              ? stores.map((store, i) => <StoreCard key={store.id} store={store} index={i} />)
              : stores
                  .filter((s) => s.id === currentStoreId)
                  .map((store, i) => <StoreCard key={store.id} store={store} index={i} />)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-serif text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-danger-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-danger-600" />
              </span>
              紧急缺货提醒
              {stats.urgentCount > 0 && (
                <span className="ml-auto text-xs badge bg-danger-100 text-danger-600">
                  {stats.urgentCount} 条
                </span>
              )}
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {urgentDemands.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">暂无紧急需求 🎉</p>
              ) : (
                urgentDemands.slice(0, 8).map((d) => {
                  const mat = getMaterialById(d.materialId);
                  const store = getStoreById(d.storeId);
                  return (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl border border-danger-100 bg-danger-50/50 hover:bg-danger-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {store && (
                            <div
                              className={`w-6 h-6 rounded-full ${store.badgeColor} text-white flex items-center justify-center text-[10px] font-bold`}
                            >
                              {store.name.charAt(5)}
                            </div>
                          )}
                          <span className="text-xs text-slate-600">
                            {store?.name.replace("优齿口腔·", "")}
                          </span>
                        </div>
                        <UrgencyBadge urgency={d.urgency} />
                      </div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800">
                          {mat?.name}
                        </span>
                        <span className="text-sm font-bold text-brand-700">
                          {d.quantity}
                          {mat?.unit}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{d.reason}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <StatusBadge status={d.status} />
                        <button
                          onClick={() => navigate("/approve")}
                          className="text-[11px] text-brand-600 hover:underline"
                        >
                          处理 →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-serif text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-accent-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-accent-600" />
              </span>
              近期到货预告
            </h2>
            <div className="space-y-3">
              {deliveringOrders.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">暂无配送中订单</p>
              ) : (
                deliveringOrders.slice(0, 5).map((o) => {
                  const mat = getMaterialById(o.materialId);
                  const d = daysFromNow(o.expectedArrival);
                  return (
                    <div
                      key={o.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-accent-50/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          d !== null && d <= 1
                            ? "bg-accent-500 text-white"
                            : "bg-white text-brand-600 border border-slate-200"
                        }`}
                      >
                        {d !== null && d <= 1 ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <span className="font-bold text-sm">
                            {d !== null && d >= 0 ? `T+${d}` : "已到"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {mat?.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {o.totalQuantity}
                          {mat?.unit} · 预计{" "}
                          {o.expectedArrival && formatDateShort(o.expectedArrival)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
