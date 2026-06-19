import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Merge, Sparkles, AlertTriangle, Search, Scale, CheckCircle2 } from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import SpecGroup from "@/components/merge/SpecGroup";
import type { Demand } from "@/types";
import { DecisionBadge } from "@/components/common/Badge";
import { formatDateShort, daysFromNow } from "@/utils/date";
import { MATERIAL_CATEGORIES } from "@/data/materials";

export default function MergeOrders() {
  const navigate = useNavigate();
  const {
    materials,
    mergedOrders,
    demands,
    currentWeek,
    currentRole,
    autoMergeDemands,
    createMergedOrder,
    setSelectedMaterialForCompare,
    getStoreById,
    getDemandsByMaterial,
    removeMergedOrder,
  } = useProcurementStore();

  const [selectedCategory, setSelectedCategory] = useState("全部分类");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"unmerged" | "merged">("unmerged");

  const submittedDemands = useMemo(
    () => demands.filter((d) => d.week === currentWeek && d.status !== "draft"),
    [demands, currentWeek]
  );

  const unmergedGroups = useMemo(() => {
    const byMaterial = new Map<string, Demand[]>();
    for (const d of submittedDemands) {
      if (d.mergedOrderId) continue;
      if (!byMaterial.has(d.materialId)) byMaterial.set(d.materialId, []);
      byMaterial.get(d.materialId)!.push(d);
    }
    const list = Array.from(byMaterial.entries())
      .map(([mid, dList]) => ({ material: materials.find((m) => m.id === mid)!, demands: dList }))
      .filter((g) => g.material);
    return list.filter((g) => {
      const catOk = selectedCategory === "全部分类" || g.material.category === selectedCategory;
      const sOk =
        !search ||
        g.material.name.includes(search) ||
        g.material.spec.includes(search);
      return catOk && sOk;
    });
  }, [submittedDemands, materials, selectedCategory, search]);

  const mergedGroups = useMemo(() => {
    const list = mergedOrders
      .filter((o) => {
        const mat = materials.find((m) => m.id === o.materialId);
        if (!mat) return false;
        const catOk = selectedCategory === "全部分类" || mat.category === selectedCategory;
        const sOk = !search || mat.name.includes(search) || mat.spec.includes(search);
        return catOk && sOk;
      })
      .map((o) => ({
        order: o,
        material: materials.find((m) => m.id === o.materialId)!,
        demands: getDemandsByMaterial(o.materialId).filter((d) => d.mergedOrderId === o.id),
      }));
    return list;
  }, [mergedOrders, materials, selectedCategory, search, getDemandsByMaterial]);

  const totalSavings = unmergedGroups
    .filter((g) => g.demands.length > 1)
    .reduce((s, g) => s + g.demands.length - 1, 0);

  if (currentRole === "branch") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warn-100 flex items-center justify-center">
            <Layers className="w-10 h-10 text-warn-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800 mb-3">仅采购主管可访问</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            汇总合并页是总部采购主管的专属功能，用于将各门店的同规格需求合并下单。
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            返回总览
          </button>
        </div>
      </div>
    );
  }

  const currentGroups = viewMode === "unmerged" ? unmergedGroups : mergedGroups;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">需求汇总与合单</h1>
            <p className="page-subtitle">
              按规格自动聚合各门店需求，合单采购以降低 MOQ 和议价成本
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                autoMergeDemands();
              }}
              className="btn-accent"
            >
              <Sparkles className="w-4 h-4" />
              一键智能合单
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <div className="text-xs text-white/70 mb-1">待合并规格</div>
          <div className="text-3xl font-serif font-bold">{unmergedGroups.length}</div>
          <div className="text-[11px] text-white/60 mt-2">项规格有未合并需求</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-slate-500 mb-1">合单批次</div>
          <div className="text-3xl font-serif font-bold text-brand-700">{mergedOrders.length}</div>
          <div className="text-[11px] text-slate-500 mt-2">已生成合并订单</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warn-500" />
            紧急需求
          </div>
          <div className="text-3xl font-serif font-bold text-warn-600">
            {
              submittedDemands.filter(
                (d) => d.urgency === "urgent" || d.urgency === "critical"
              ).length
            }
          </div>
          <div className="text-[11px] text-slate-500 mt-2">需优先处理</div>
        </div>
        <div className="card p-5 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 text-white">
          <div className="text-xs text-white/80 mb-1">预计减少下单数</div>
          <div className="text-3xl font-serif font-bold">{totalSavings}</div>
          <div className="text-[11px] text-white/70 mt-2">合单后精简订单数量</div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex p-1 rounded-xl bg-slate-100">
            <button
              onClick={() => setViewMode("unmerged")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "unmerged"
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Merge className="w-4 h-4" />
                待合并
                <span className="text-xs bg-brand-100 text-brand-700 px-1.5 rounded-full">
                  {unmergedGroups.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setViewMode("merged")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "merged"
                  ? "bg-white text-accent-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                已合并
                <span className="text-xs bg-accent-100 text-accent-700 px-1.5 rounded-full">
                  {mergedGroups.length}
                </span>
              </span>
            </button>
          </div>

          <div className="flex-1 flex items-center gap-3 justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索耗材名称..."
                className="input-sm pl-9 w-56"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {MATERIAL_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
        </div>
      </div>

      {viewMode === "merged" && mergedGroups.length > 0 && (
        <div className="card p-5">
          <h2 className="font-serif text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-600" />
            合并订单批次
            <span className="text-xs text-slate-500 font-normal ml-2">
              点击操作进入比价或审批
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th rounded-l-lg">合单编号</th>
                  <th className="table-th">耗材</th>
                  <th className="table-th">总数量</th>
                  <th className="table-th">门店数</th>
                  <th className="table-th">供应商</th>
                  <th className="table-th">决策</th>
                  <th className="table-th">预计到货</th>
                  <th className="table-th w-16 rounded-r-lg">操作</th>
                </tr>
              </thead>
              <tbody>
                {mergedGroups.map(({ order, material, demands: mDemands }) => {
                  const supplier = order.supplierId
                    ? getStoreById(order.supplierId) ?? { name: "未选" }
                    : { name: "未选择" };
                  const d = daysFromNow(order.expectedArrival);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60">
                      <td className="table-td font-mono text-xs text-brand-600">{order.id}</td>
                      <td className="table-td">
                        <div className="font-medium text-slate-800">{material.name}</div>
                        <div className="text-xs text-slate-500">{material.spec}</div>
                      </td>
                      <td className="table-td font-bold text-brand-700">
                        {order.totalQuantity} {material.unit}
                      </td>
                      <td className="table-td">
                        <span className="badge bg-violet-100 text-violet-700">
                          {new Set(mDemands.map((x) => x.storeId)).size} 家
                        </span>
                      </td>
                      <td className="table-td text-sm text-slate-700">
                        {(supplier as { name: string }).name}
                      </td>
                      <td className="table-td"><DecisionBadge decision={order.decision} /></td>
                      <td className="table-td">
                        {order.expectedArrival ? (
                          <span
                            className={`text-sm font-medium ${
                              d !== null && d <= 1 ? "text-accent-600" : "text-slate-700"
                            }`}
                          >
                            {formatDateShort(order.expectedArrival)}
                            {d !== null && d >= 0 && (
                              <span className="text-xs text-slate-500 ml-1">({d}天后)</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="table-td">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMaterialForCompare(material.id);
                              navigate("/compare");
                            }}
                            className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600"
                            title="供应商比价"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate("/approve")}
                            className="p-1.5 rounded-lg hover:bg-accent-50 text-accent-600"
                            title="审批决策"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          {order.decision === "pending" && (
                            <button
                              onClick={() => removeMergedOrder(order.id)}
                              className="p-1.5 rounded-lg hover:bg-danger-50 text-danger-500"
                              title="取消合并"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        {currentGroups.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Merge className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-slate-800 mb-2">
              {viewMode === "unmerged" ? "所有需求已完成合并 🎉" : "暂无合并订单"}
            </h2>
            <p className="text-slate-500 mb-6">
              {viewMode === "unmerged"
                ? "各门店需求均已合并为采购批次，可前往审批。"
                : "请在待合并标签中选择规格创建合并订单。"}
            </p>
            <button onClick={() => navigate(viewMode === "unmerged" ? "/approve" : "/")} className="btn-primary">
              {viewMode === "unmerged" ? "前往审批决策" : "返回总览"}
            </button>
          </div>
        ) : (
          viewMode === "unmerged" &&
          unmergedGroups.map((g, i) => (
            <div style={{ animationDelay: `${i * 40}ms` }} key={g.material.id}>
              <SpecGroup
                material={g.material}
                demands={g.demands}
                onMerge={
                  g.demands.length > 1
                    ? () => createMergedOrder(g.material.id, g.demands.map((d) => d.id))
                    : undefined
                }
                onCompare={() => {
                  setSelectedMaterialForCompare(g.material.id);
                  navigate("/compare");
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
