import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  ChevronLeft,
  Package,
  Sparkles,
  CheckCircle2,
  Layers,
  AlertCircle,
  TrendingDown,
  Store,
} from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import SupplierCard from "@/components/cards/SupplierCard";
import RatingStars from "@/components/common/RatingStars";
import { MATERIALS, MATERIAL_CATEGORIES } from "@/data/materials";
import { formatDateShort, addDaysFromNow } from "@/utils/date";

export default function CompareSuppliers() {
  const navigate = useNavigate();
  const {
    materials,
    mergedOrders,
    selectedMaterialForCompare,
    setSelectedMaterialForCompare,
    getPricesForMaterial,
    getDemandsByMaterial,
    currentWeek,
    getStoreById,
    selectSupplier,
    setDecision,
    currentRole,
  } = useProcurementStore();

  const [selectedCategory, setSelectedCategory] = useState("全部分类");

  const activeMaterialId = selectedMaterialForCompare || materials[0]?.id;
  const activeMaterial = materials.find((m) => m.id === activeMaterialId);
  const prices = activeMaterial ? getPricesForMaterial(activeMaterial.id) : [];

  const relatedDemands = activeMaterial
    ? getDemandsByMaterial(activeMaterial.id).filter((d) => d.week === currentWeek)
    : [];
  const totalQty = relatedDemands.reduce((s, d) => s + d.quantity, 0);
  const relatedOrder = mergedOrders.find((o) => o.materialId === activeMaterialId);

  const recommendedId = useMemo(() => {
    if (prices.length === 0) return null;
    const scored = prices
      .filter((p) => totalQty >= p.moq)
      .map((p) => {
        const normPrice = 1 - (p.price - Math.min(...prices.map((x) => x.price))) /
          (Math.max(...prices.map((x) => x.price)) - Math.min(...prices.map((x) => x.price)) + 1);
        const normRating = (p.supplier.rating - 3) / 2;
        const normDelivery = 1 - p.deliveryDays / 7;
        const score = normPrice * 0.5 + normRating * 0.3 + normDelivery * 0.2;
        return { id: p.id, score };
      })
      .sort((a, b) => b.score - a.score);
    return scored[0]?.id ?? prices[0]?.id;
  }, [prices, totalQty]);

  const handleSelect = (supplierId: string, priceId: string) => {
    if (!relatedOrder) return;
    selectSupplier(relatedOrder.id, supplierId);
  };

  const handleConfirmAndApprove = (supplierId: string) => {
    if (!relatedOrder) return;
    const price = prices.find((p) => p.supplierId === supplierId);
    const deliveryDays = price?.deliveryDays ?? 3;
    selectSupplier(relatedOrder.id, supplierId);
    setDecision(relatedOrder.id, "order_now", deliveryDays);
  };

  if (currentRole === "branch") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warn-100 flex items-center justify-center">
            <Scale className="w-10 h-10 text-warn-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800 mb-3">仅采购主管可访问</h1>
          <p className="text-slate-500 mb-8">供应商比价为总部专属控价功能</p>
          <button onClick={() => navigate("/")} className="btn-primary">返回总览</button>
        </div>
      </div>
    );
  }

  const filteredMaterials = MATERIALS.filter(
    (m) => selectedCategory === "全部分类" || m.category === selectedCategory
  );

  const avgPrice = prices.length > 0
    ? (prices.reduce((s, p) => s + p.price, 0) / prices.length).toFixed(1)
    : "0";
  const minPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate("/merge")}
              className="text-sm text-slate-500 hover:text-brand-600 mb-2 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              返回汇总合并
            </button>
            <h1 className="page-title">供应商比价中心</h1>
            <p className="page-subtitle">
              并排对比报价、配送周期、MOQ、履约评分，精准控价择优
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <div className="card p-3 sticky top-24 space-y-3">
            <div className="px-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600" />
                选择耗材
              </h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {MATERIAL_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                      selectedCategory === c
                        ? "bg-brand-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-1">
              {filteredMaterials.map((m) => {
                const mPrices = getPricesForMaterial(m.id);
                const order = mergedOrders.find((o) => o.materialId === m.id);
                const active = m.id === activeMaterialId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMaterialForCompare(m.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      active
                        ? "bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-200"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`text-sm font-medium ${
                          active ? "text-brand-700" : "text-slate-800"
                        }`}
                      >
                        {m.name}
                      </span>
                      {order && order.supplierId && (
                        <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{m.spec}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">
                        {mPrices.length} 家供应商
                      </span>
                      {order && (
                        <span className="text-[10px] badge bg-violet-100 text-violet-700 py-0">
                          {order.totalQuantity}
                          {m.unit}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          {activeMaterial && (
            <>
              <div className="card p-6 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-400" />
                  <div className="absolute -bottom-32 left-20 w-80 h-80 rounded-full bg-white" />
                </div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-medium mb-3">
                        {activeMaterial.category}
                      </span>
                      <h2 className="font-serif text-3xl font-bold mb-1">
                        {activeMaterial.name}
                      </h2>
                      <p className="text-white/75 text-sm">{activeMaterial.spec}</p>
                    </div>
                    {relatedOrder && (
                      <div className="text-right">
                        <div className="text-xs text-white/60 mb-1">合单总需求量</div>
                        <div className="font-serif text-4xl font-bold">
                          {relatedOrder.totalQuantity}
                          <span className="text-lg text-white/70 ml-1 font-normal">
                            {activeMaterial.unit}
                          </span>
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs bg-white/15 px-3 py-1 rounded-full">
                          <Store className="w-3 h-3" />
                          {new Set(relatedDemands.map((d) => d.storeId)).size} 家门店
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                    <div>
                      <div className="text-xs text-white/60 mb-1">供应商平均价</div>
                      <div className="font-serif text-2xl font-bold">¥{avgPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> 最低价
                      </div>
                      <div className="font-serif text-2xl font-bold text-accent-300">¥{minPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">预算范围</div>
                      <div className="font-serif text-2xl font-bold">
                        ¥{prices.length ? (parseFloat(minPrice) * totalQty).toLocaleString() : 0} ~ ¥
                        {prices.length
                          ? (Math.max(...prices.map((p) => p.price)) * totalQty).toLocaleString()
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {relatedDemands.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-serif text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-600" />
                    各门店申请明细
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relatedDemands.map((d) => {
                      const s = getStoreById(d.storeId);
                      return (
                        <div
                          key={d.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {s && (
                              <div
                                className={`w-7 h-7 rounded-full ${s.badgeColor} text-white flex items-center justify-center text-[11px] font-bold`}
                              >
                                {s.name.charAt(5)}
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-800 truncate">
                              {s?.name.replace("优齿口腔·", "")}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-500">申请</span>
                            <span className="text-lg font-bold text-brand-700">
                              {d.quantity}
                              <span className="text-xs text-slate-500 font-normal ml-0.5">
                                {activeMaterial.unit}
                              </span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{d.reason}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-serif text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent-600" />
                  供应商比价对比
                  {recommendedId && (
                    <span className="text-xs font-normal badge bg-accent-100 text-accent-700 ml-2">
                      <Sparkles className="w-3 h-3" />
                      绿色推荐 = 综合性价比最优
                    </span>
                  )}
                </h3>

                {prices.length === 0 ? (
                  <div className="card p-12 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">该耗材暂无合作供应商报价，请联系采购拓展供应商</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {prices.map((p) => (
                      <SupplierCard
                        key={p.id}
                        price={p}
                        quantity={relatedOrder?.totalQuantity || totalQty || 10}
                        isRecommended={p.id === recommendedId}
                        selected={relatedOrder?.supplierId === p.supplierId}
                        onSelect={() => handleSelect(p.supplierId, p.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {relatedOrder && relatedOrder.supplierId && (
                <div className="card p-6 border-2 border-accent-300 bg-accent-50/30 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent-500 text-white flex items-center justify-center shadow-lg shadow-accent-200 shrink-0">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-slate-800 mb-1">
                          已选择供应商 · 确认下单？
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {
                            prices.find((p) => p.supplierId === relatedOrder.supplierId)
                              ?.supplier.name
                          }
                          {" · 单价 "}
                          <span className="font-bold text-brand-700">
                            ¥
                            {prices
                              .find((p) => p.supplierId === relatedOrder.supplierId)
                              ?.price.toFixed(1)}
                          </span>
                          {"，预计 "}
                          <span className="font-bold text-accent-700">
                            ¥{(relatedOrder.finalPrice || 0).toLocaleString()}
                          </span>
                          {" 元成交"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <RatingStars
                            rating={
                              prices.find((p) => p.supplierId === relatedOrder.supplierId)
                                ?.supplier.rating || 4.5
                            }
                            showValue
                          />
                          <span>·</span>
                          <span>
                            配送周期{" "}
                            {prices.find((p) => p.supplierId === relatedOrder.supplierId)
                              ?.deliveryDays || 3}
                            天
                          </span>
                          <span>·</span>
                          <span>
                            预计到货{" "}
                            <span className="font-semibold text-brand-700">
                              {formatDateShort(
                                addDaysFromNow(
                                  prices.find((p) => p.supplierId === relatedOrder.supplierId)
                                    ?.deliveryDays || 3
                                )
                              )}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => selectSupplier(relatedOrder.id, "")}
                        className="btn-outline"
                      >
                        重新选择
                      </button>
                      <button
                        onClick={() => handleConfirmAndApprove(relatedOrder.supplierId!)}
                        className="btn-accent px-6 py-3 text-base shadow-lg shadow-accent-200"
                      >
                        <Sparkles className="w-5 h-5" />
                        确认下单，生成审批
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
