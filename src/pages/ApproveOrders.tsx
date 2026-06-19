import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Zap,
  Calendar,
  Layers,
  Package,
  Store,
  CheckCircle2,
  AlertTriangle,
  Pause,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import { DecisionBadge, UrgencyBadge } from "@/components/common/Badge";
import type { Decision } from "@/types";
import { formatDateShort, addDaysFromNow } from "@/utils/date";

export default function ApproveOrders() {
  const navigate = useNavigate();
  const {
    mergedOrders,
    materials,
    demands,
    getMaterialById,
    getStoreById,
    setDecision,
    getPricesForMaterial,
    selectSupplier,
    currentRole,
  } = useProcurementStore();

  const [filterDecision, setFilterDecision] = useState<"all" | Decision>("all");
  const [editDateOrder, setEditDateOrder] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState("");

  if (currentRole === "branch") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warn-100 flex items-center justify-center">
            <ClipboardCheck className="w-10 h-10 text-warn-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800 mb-3">仅采购主管可访问</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            审批决策页为主管专用，标记"立即订/下周合单/暂缓"后会自动回写给各分院。
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            返回总览
          </button>
        </div>
      </div>
    );
  }

  const filtered = mergedOrders.filter(
    (o) => filterDecision === "all" || o.decision === filterDecision
  );
  const stats = {
    total: mergedOrders.length,
    pending: mergedOrders.filter((o) => o.decision === "pending").length,
    order_now: mergedOrders.filter((o) => o.decision === "order_now").length,
    next_week: mergedOrders.filter((o) => o.decision === "next_week").length,
    hold: mergedOrders.filter((o) => o.decision === "hold").length,
  };

  function handleDecision(orderId: string, decision: Decision) {
    const order = mergedOrders.find((o) => o.id === orderId);
    if (!order) return;
    const prices = getPricesForMaterial(order.materialId);
    let days = 3;
    if (prices.length > 0) days = prices[0].deliveryDays;
    if (!order.supplierId && prices.length > 0) {
      selectSupplier(orderId, prices[0].supplierId);
    }
    setDecision(orderId, decision, days);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">审批决策中心</h1>
            <p className="page-subtitle">
              批量处理合并采购单，审批结果与预计到货时间自动回写给对应门店
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            key: "all",
            label: "全部合单",
            value: stats.total,
            Icon: Layers,
            bg: "bg-gradient-to-br from-slate-600 to-slate-800",
          },
          {
            key: "pending",
            label: "待决策",
            value: stats.pending,
            Icon: AlertTriangle,
            bg: "bg-gradient-to-br from-warn-500 to-warn-700",
          },
          {
            key: "order_now",
            label: "立即订",
            value: stats.order_now,
            Icon: Zap,
            bg: "bg-gradient-to-br from-accent-500 to-accent-700",
          },
          {
            key: "next_week",
            label: "下周合单",
            value: stats.next_week,
            Icon: Calendar,
            bg: "bg-gradient-to-br from-brand-500 to-brand-700",
          },
          {
            key: "hold",
            label: "暂缓",
            value: stats.hold,
            Icon: Pause,
            bg: "bg-gradient-to-br from-slate-400 to-slate-600",
          },
        ].map((item, i) => {
          const active = filterDecision === item.key;
          const Icon = item.Icon;
          return (
            <button
              key={item.key}
              onClick={() => setFilterDecision(item.key as any)}
              className={`text-left relative overflow-hidden rounded-2xl p-5 text-white transition-all duration-300 animate-fade-in-up ${
                active
                  ? "ring-4 ring-offset-2 ring-brand-300 scale-[1.02] shadow-xl"
                  : "hover:scale-[1.01] shadow-card hover:shadow-card-hover"
              }`}
              style={{ background: item.bg, animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                  {item.label}
                </span>
                <Icon className="w-5 h-5 text-white/80" />
              </div>
              <div className="font-serif text-3xl font-bold mt-2">{item.value}</div>
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/60" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
          <Filter className="w-3.5 h-3.5" />
          当前显示 {filtered.length} / {mergedOrders.length} 条合单
        </div>
        <button onClick={() => navigate("/merge")} className="btn-outline text-sm">
          <Layers className="w-4 h-4" />
          前往创建新合单
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <ClipboardCheck className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-slate-800 mb-2">
            当前筛选无合单记录
          </h2>
          <p className="text-slate-500 mb-6">
            {filterDecision === "pending"
              ? "所有合单均已完成审批，效率出众！"
              : "请调整筛选条件或创建新的合并订单"}
          </p>
          <button
            onClick={() => setFilterDecision("all")}
            className="btn-primary"
          >
            查看全部合单
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => {
            const mat = getMaterialById(order.materialId);
            const orderDemands = demands.filter((d) => order.demandIds.includes(d.id));
            const stores = new Set(orderDemands.map((d) => d.storeId));
            const prices = getPricesForMaterial(order.materialId);
            const selectedPrice = order.supplierId
              ? prices.find((p) => p.supplierId === order.supplierId)
              : null;
            const urgentCount = orderDemands.filter(
              (d) => d.urgency === "urgent" || d.urgency === "critical"
            ).length;

            const rowBgByDecision = {
              pending: "border-l-4 border-l-warn-400",
              order_now: "border-l-4 border-l-accent-500 bg-accent-50/20",
              next_week: "border-l-4 border-l-brand-400 bg-brand-50/20",
              hold: "border-l-4 border-l-slate-300 bg-slate-50/50",
            };

            return (
              <div
                key={order.id}
                className={`card overflow-hidden animate-fade-in-up ${rowBgByDecision[order.decision]}`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-4 flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          order.decision === "order_now"
                            ? "bg-accent-100 text-accent-600"
                            : order.decision === "pending"
                            ? "bg-warn-100 text-warn-600"
                            : order.decision === "next_week"
                            ? "bg-brand-100 text-brand-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Package className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-serif text-xl font-bold text-slate-800">
                            {mat?.name}
                          </h3>
                          {urgentCount > 0 && (
                            <span className="badge bg-danger-100 text-danger-600">
                              <AlertTriangle className="w-3 h-3" />
                              含 {urgentCount} 紧急
                            </span>
                          )}
                          <DecisionBadge decision={order.decision} />
                        </div>
                        <p className="text-sm text-slate-500 mb-3">
                          <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded mr-2">
                            #{order.id}
                          </span>
                          规格：{mat?.spec}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-violet-500" />
                            {order.totalQuantity} {mat?.unit}
                          </span>
                          <span className="flex items-center gap-1">
                            <Store className="w-3.5 h-3.5 text-brand-500" />
                            {stores.size} 家门店
                          </span>
                          {selectedPrice && (
                            <span className="font-semibold text-accent-700">
                              ¥{(order.finalPrice || 0).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {orderDemands.slice(0, 8).map((d) => {
                          const s = getStoreById(d.storeId);
                          return (
                            <div
                              key={d.id}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                              {s && (
                                <div
                                  className={`w-4.5 h-4.5 w-5 h-5 rounded-full ${s.badgeColor} text-white flex items-center justify-center text-[9px] font-bold`}
                                >
                                  {s.name.charAt(5)}
                                </div>
                              )}
                              <span className="text-[11px] text-slate-700 font-medium">
                                {s?.name.replace("优齿口腔·", "").slice(0, 6)}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {d.quantity}
                                {mat?.unit}
                              </span>
                              <UrgencyBadge urgency={d.urgency} />
                            </div>
                          );
                        })}
                        {orderDemands.length > 8 && (
                          <span className="text-[11px] text-slate-500 px-2 py-1">
                            +{orderDemands.length - 8} 门店...
                          </span>
                        )}
                      </div>

                      {order.decision === "order_now" && order.expectedArrival && (
                        <div className="p-3 rounded-xl bg-accent-50 border border-accent-200 text-sm flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-accent-600 shrink-0" />
                          <div className="flex-1">
                            <span className="text-slate-700">预计到货日期：</span>
                            <span className="font-bold text-accent-700">
                              {formatDateShort(order.expectedArrival)}
                            </span>
                            <span className="text-xs text-slate-500 ml-2">
                              （将自动回写给 {stores.size} 家门店）
                            </span>
                          </div>
                          {editDateOrder === order.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={tempDate}
                                onChange={(e) => setTempDate(e.target.value)}
                                className="input-sm w-auto"
                              />
                              <button
                                onClick={() => {
                                  setDecision(order.id, "order_now", 0);
                                  const fn = setDecision as any;
                                  if (fn.__setDate && tempDate) {
                                    fn.__setDate(order.id, tempDate);
                                  }
                                  setEditDateOrder(null);
                                }}
                                className="btn-accent text-xs py-1.5 px-3"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setEditDateOrder(null)}
                                className="btn-ghost text-xs py-1.5 px-3"
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditDateOrder(order.id);
                                setTempDate(order.expectedArrival!);
                              }}
                              className="text-xs text-accent-700 hover:underline flex items-center gap-1"
                            >
                              调整 <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                      {order.decision === "next_week" && order.expectedArrival && (
                        <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-sm flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-brand-600 shrink-0" />
                          <div>
                            <span className="text-slate-700">将于下周一处理合单，预计到货：</span>
                            <span className="font-bold text-brand-700">
                              {formatDateShort(order.expectedArrival)}
                            </span>
                          </div>
                        </div>
                      )}
                      {order.decision === "hold" && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm flex items-center gap-3 text-slate-600">
                          <Pause className="w-5 h-5 shrink-0" />
                          <span>已暂缓下单，请关注库存提醒后续再次评估</span>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-2">
                      {order.decision === "pending" && (
                        <>
                          <button
                            onClick={() => handleDecision(order.id, "order_now")}
                            className="btn-accent w-full justify-start px-4 py-3 shadow-md shadow-accent-200/50"
                          >
                            <Zap className="w-5 h-5" />
                            <div className="text-left flex-1">
                              <div className="font-bold">立即订</div>
                              <div className="text-[11px] text-white/75 font-normal">
                                今日下采购单
                                {selectedPrice && ` · ${selectedPrice.deliveryDays}天到`}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-60" />
                          </button>
                          <button
                            onClick={() => handleDecision(order.id, "next_week")}
                            className="btn-primary w-full justify-start px-4 py-3"
                          >
                            <Calendar className="w-5 h-5" />
                            <div className="text-left flex-1">
                              <div className="font-bold">下周合单</div>
                              <div className="text-[11px] text-white/75 font-normal">
                                凑量议价·下周一处理
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-60" />
                          </button>
                          <button
                            onClick={() => handleDecision(order.id, "hold")}
                            className="btn-ghost w-full justify-start px-4 py-3"
                          >
                            <Pause className="w-5 h-5" />
                            <div className="text-left flex-1">
                              <div className="font-bold">暂缓</div>
                              <div className="text-[11px] text-slate-500 font-normal">
                                库存充足或评估后再定
                              </div>
                            </div>
                          </button>
                        </>
                      )}
                      {order.decision === "order_now" && (
                        <button
                          onClick={() => setDecision(order.id, "pending")}
                          className="btn-outline w-full justify-center"
                        >
                          <Layers className="w-4 h-4" />
                          撤回决策（回待决策）
                        </button>
                      )}
                      {(order.decision === "next_week" || order.decision === "hold") && (
                        <>
                          <button
                            onClick={() => handleDecision(order.id, "order_now")}
                            className="btn-accent w-full justify-center"
                          >
                            <Zap className="w-4 h-4" />
                            改为立即订
                          </button>
                          <button
                            onClick={() => setDecision(order.id, "pending")}
                            className="btn-outline w-full justify-center"
                          >
                            撤回决策
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
