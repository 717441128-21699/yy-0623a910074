import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Package,
  AlertCircle,
  Info,
} from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import { UrgencyBadge } from "@/components/common/Badge";
import { MATERIAL_CATEGORIES, MATERIALS } from "@/data/materials";
import type { Urgency } from "@/types";
import { getWeekLabel } from "@/utils/date";

const QUICK_TEMPLATES = [
  { materialId: "m01", quantity: 10, reason: "儿牙涂氟剂低库存", urgency: "urgent" as Urgency },
  { materialId: "m03", quantity: 30, reason: "正畸橡皮圈新增颜色", urgency: "normal" as Urgency },
  { materialId: "m06", quantity: 10, reason: "藻酸盐日常补充", urgency: "normal" as Urgency },
  { materialId: "m08", quantity: 150, reason: "口内扫描头保护套快用完", urgency: "urgent" as Urgency },
  { materialId: "m09", quantity: 10, reason: "灭菌袋补充", urgency: "normal" as Urgency },
  { materialId: "m12", quantity: 20, reason: "丁腈手套低库存", urgency: "urgent" as Urgency },
];

export default function SubmitDemand() {
  const navigate = useNavigate();
  const {
    currentWeek,
    currentStoreId,
    getStoreById,
    addDemand,
    updateDemand,
    deleteDemand,
    submitWeekDemands,
    getDemandsByStore,
    getMaterialById,
    currentRole,
    setCurrentStore,
    stores,
  } = useProcurementStore();

  const store = getStoreById(currentStoreId!);
  const storeDemands = getDemandsByStore(currentStoreId!).filter((d) => d.week === currentWeek);
  const drafts = storeDemands.filter((d) => d.status === "draft");
  const submitted = storeDemands.filter((d) => d.status !== "draft");

  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部分类");
  const [materialSearch, setMaterialSearch] = useState("");

  const filteredMaterials = MATERIALS.filter((m) => {
    const catOk = selectedCategory === "全部分类" || m.category === selectedCategory;
    const searchOk =
      !materialSearch ||
      m.name.includes(materialSearch) ||
      m.spec.includes(materialSearch);
    return catOk && searchOk;
  });

  const totalQty = storeDemands.reduce((s, d) => s + d.quantity, 0);
  const urgentCount = storeDemands.filter(
    (d) => d.urgency === "urgent" || d.urgency === "critical"
  ).length;

  function handleAddFromTemplate(tpl: (typeof QUICK_TEMPLATES)[number]) {
    if (!currentStoreId) return;
    const exist = storeDemands.find((d) => d.materialId === tpl.materialId && d.status === "draft");
    if (exist) {
      updateDemand(exist.id, {
        quantity: exist.quantity + tpl.quantity,
        urgency: tpl.urgency,
        reason: tpl.reason,
      });
    } else {
      addDemand({
        storeId: currentStoreId,
        materialId: tpl.materialId,
        quantity: tpl.quantity,
        urgency: tpl.urgency,
        reason: tpl.reason,
      });
    }
  }

  function handleAddCustom(materialId: string) {
    if (!currentStoreId) return;
    const exist = drafts.find((d) => d.materialId === materialId);
    if (exist) return;
    addDemand({
      storeId: currentStoreId,
      materialId,
      quantity: 1,
      urgency: "normal",
      reason: "",
    });
  }

  if (currentRole === "hq") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warn-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-warn-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800 mb-3">切换到分院模式</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            需求提交页专为分院负责人设计，请在右上角切换身份为「分院负责人」后选择门店，再进行需求填报。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentStore("s01");
              }}
              className="btn-outline"
            >
              选择示例门店
            </button>
            <button onClick={() => navigate("/")} className="btn-primary">
              返回总览
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">填写本周缺货需求</h1>
            <p className="page-subtitle">
              {store?.name} · {getWeekLabel(currentWeek)} · 截止前可多次修改
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">本周五提交截止</div>
              <div className="font-bold text-brand-700">
                {storeDemands.length} 项 / {totalQty} 件
                {urgentCount > 0 && (
                  <span className="ml-2 text-danger-600 text-sm">含{urgentCount}急单</span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (!currentStoreId) return;
                submitWeekDemands(currentStoreId);
              }}
              disabled={drafts.length === 0}
              className="btn-accent"
            >
              <Send className="w-4 h-4" />
              提交全部草稿
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                草稿条目（可编辑）
                {drafts.length > 0 && (
                  <span className="text-xs badge bg-brand-100 text-brand-700 ml-2">
                    {drafts.length} 条待提交
                  </span>
                )}
              </h2>
              {drafts.length > 0 && (
                <button className="btn-outline text-xs py-1.5 px-3">
                  <Save className="w-3.5 h-3.5" />
                  保存草稿
                </button>
              )}
            </div>

            {drafts.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-4">暂无草稿，从右侧耗材库或快捷模板添加</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-th rounded-l-lg">耗材名称·规格</th>
                      <th className="table-th w-24">数量</th>
                      <th className="table-th w-28">紧急度</th>
                      <th className="table-th">申请理由</th>
                      <th className="table-th rounded-r-lg w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map((d) => {
                      const mat = getMaterialById(d.materialId);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="table-td">
                            <div className="font-medium text-slate-800">{mat?.name}</div>
                            <div className="text-xs text-slate-500">{mat?.spec}</div>
                          </td>
                          <td className="table-td">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={1}
                                value={d.quantity}
                                onChange={(e) =>
                                  updateDemand(d.id, { quantity: parseInt(e.target.value) || 1 })
                                }
                                className="input-sm w-16 text-center"
                              />
                              <span className="text-xs text-slate-500">{mat?.unit}</span>
                            </div>
                          </td>
                          <td className="table-td">
                            <select
                              value={d.urgency}
                              onChange={(e) =>
                                updateDemand(d.id, { urgency: e.target.value as Urgency })
                              }
                              className="input-sm"
                            >
                              <option value="normal">常规</option>
                              <option value="urgent">紧急</option>
                              <option value="critical">特急</option>
                            </select>
                          </td>
                          <td className="table-td">
                            <input
                              type="text"
                              value={d.reason}
                              onChange={(e) => updateDemand(d.id, { reason: e.target.value })}
                              placeholder="如：低库存/新增患者..."
                              className="input-sm"
                            />
                          </td>
                          <td className="table-td">
                            <button
                              onClick={() => deleteDemand(d.id)}
                              className="p-2 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {submitted.length > 0 && (
            <div className="card p-5">
              <h2 className="font-serif text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-accent-600" />
                已提交（不可修改）
                <span className="ml-auto text-xs badge bg-accent-100 text-accent-700">
                  {submitted.length} 条已送审
                </span>
              </h2>
              <div className="space-y-2">
                {submitted.map((d) => {
                  const mat = getMaterialById(d.materialId);
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 text-sm">
                          {mat?.name}
                          <span className="text-xs text-slate-500 ml-2">{mat?.spec}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{d.reason}</div>
                      </div>
                      <div className="text-sm font-bold text-brand-700">
                        {d.quantity}
                        {mat?.unit}
                      </div>
                      <UrgencyBadge urgency={d.urgency} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-serif text-base font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warn-500" />
                常用快捷添加
              </h3>
              {showTemplates ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {showTemplates && (
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((tpl, i) => {
                  const mat = getMaterialById(tpl.materialId);
                  return (
                    <button
                      key={i}
                      onClick={() => handleAddFromTemplate(tpl)}
                      className="p-3 rounded-xl border border-dashed border-slate-200 hover:border-accent-400 hover:bg-accent-50/50 transition-all text-left group"
                    >
                      <div className="text-sm font-medium text-slate-800 group-hover:text-accent-700 truncate">
                        {mat?.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        +{tpl.quantity}{mat?.unit} · {tpl.reason.slice(0, 8)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-serif text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600" />
              耗材库 · 自定义添加
            </h3>
            <input
              type="text"
              placeholder="搜索耗材名称..."
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
              className="input-sm mb-3"
            />
            <div className="flex flex-wrap gap-1.5 mb-3">
              {MATERIAL_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    selectedCategory === c
                      ? "bg-brand-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
              {filteredMaterials.map((m) => {
                const inDraft = drafts.some((d) => d.materialId === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => !inDraft && handleAddCustom(m.id)}
                    disabled={inDraft}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                      inDraft
                        ? "bg-slate-50 text-slate-400 cursor-default"
                        : "hover:bg-brand-50 text-slate-700"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{m.spec}</div>
                    </div>
                    {inDraft ? (
                      <span className="text-[10px] text-slate-400 shrink-0">已添加</span>
                    ) : (
                      <Plus className="w-4 h-4 text-brand-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
