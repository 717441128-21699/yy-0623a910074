import { Star, Truck, Package, CheckCircle2, Crown } from "lucide-react";
import type { Supplier, SupplierPrice } from "@/types";

interface Props {
  price: SupplierPrice & { supplier: Supplier };
  quantity: number;
  isRecommended: boolean;
  selected: boolean;
  onSelect: () => void;
}

export default function SupplierCard({
  price,
  quantity,
  isRecommended,
  selected,
  onSelect,
}: Props) {
  const totalCost = price.price * quantity;
  const meetsMoq = quantity >= price.moq;

  return (
    <div
      onClick={meetsMoq ? onSelect : undefined}
      className={`relative rounded-2xl border-2 bg-white p-5 transition-all duration-300 ${
        selected
          ? "border-accent-500 shadow-glow ring-2 ring-accent-200"
          : isRecommended
          ? "border-accent-300 shadow-card-hover scale-[1.02]"
          : "border-slate-200 shadow-card hover:border-brand-300 hover:shadow-card-hover"
      } ${meetsMoq ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-accent-500 to-brand-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md">
          <Crown className="w-3 h-3" />
          系统推荐
        </div>
      )}
      {selected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-base font-semibold text-slate-800 leading-tight pr-2">
            {price.supplier.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 text-warn-500 fill-warn-500" />
            <span className="text-sm font-bold text-slate-800">
              {price.supplier.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          历史履约 {price.supplier.totalOrders} 单
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-baseline justify-between p-3 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50">
          <span className="text-xs text-slate-600">单价</span>
          <span className="font-serif text-2xl font-bold text-brand-700">
            ¥{price.price.toFixed(1)}
            <span className="text-xs text-slate-500 font-normal">/单位</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50">
            <div className="flex items-center gap-1 text-slate-500 mb-0.5">
              <Truck className="w-3.5 h-3.5" />
              配送周期
            </div>
            <div className="font-semibold text-slate-800">
              {price.deliveryDays} 天
              {price.deliveryDays <= 2 && (
                <span className="ml-1 text-[10px] text-accent-600 bg-accent-50 px-1.5 py-0.5 rounded">
                  快
                </span>
              )}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50">
            <div className="flex items-center gap-1 text-slate-500 mb-0.5">
              <Package className="w-3.5 h-3.5" />
              最小起订
            </div>
            <div className={`font-semibold ${meetsMoq ? "text-slate-800" : "text-danger-600"}`}>
              {price.moq}
              {!meetsMoq && <span className="ml-1 text-[10px]">不满足</span>}
            </div>
          </div>
        </div>

        {price.remark && (
          <div className="text-[11px] text-slate-500 bg-brand-50/50 p-2.5 rounded-lg border border-brand-100">
            💡 {price.remark}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-slate-500">合单总价</span>
          <span className="font-serif text-xl font-bold text-accent-600">
            ¥{totalCost.toLocaleString()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (meetsMoq) onSelect();
          }}
          disabled={!meetsMoq}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            selected
              ? "bg-accent-500 text-white"
              : isRecommended
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
        >
          {selected ? "✓ 已选择此供应商" : meetsMoq ? "选择此供应商" : "未达最小起订量"}
        </button>
      </div>
    </div>
  );
}
