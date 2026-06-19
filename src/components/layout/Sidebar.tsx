import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Merge,
  Scale,
  ClipboardCheck,
  Bell,
  Sparkles,
} from "lucide-react";
import type { UserRole } from "@/types";

interface Props {
  role: UserRole;
}

const HQ_MENU = [
  { to: "/", label: "总览看板", icon: LayoutDashboard, tag: "全部门店" },
  { to: "/merge", label: "汇总合并", icon: Merge, tag: "按规格聚合" },
  { to: "/compare", label: "供应商比价", icon: Scale, tag: "控价核心" },
  { to: "/approve", label: "审批决策", icon: ClipboardCheck, tag: "立即订/合单" },
  { to: "/feedback", label: "门店反馈", icon: Bell, tag: "到货跟踪" },
];

const BRANCH_MENU = [
  { to: "/", label: "需求总览", icon: LayoutDashboard, tag: "看板" },
  { to: "/submit", label: "提交本周需求", icon: ClipboardList, tag: "缺货品" },
  { to: "/feedback", label: "到货反馈", icon: Bell, tag: "进度跟踪" },
];

export default function Sidebar({ role }: Props) {
  const location = useLocation();
  const menu = role === "hq" ? HQ_MENU : BRANCH_MENU;

  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-68px)] sticky top-[68px] bg-gradient-to-b from-brand-500 to-brand-700 text-white flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/90">
          <Sparkles className="w-4 h-4 text-accent-300" />
          <span className="text-xs tracking-wider uppercase">
            {role === "hq" ? "采购主管控制台" : "分院工作台"}
          </span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-400 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-accent-300" : ""}`} />
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span
                  className={`text-[10px] ${active ? "text-white/60" : "text-white/40"}`}
                >
                  {item.tag}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[11px] text-white/50 leading-relaxed">
          当前周次需求提交截止：<br />
          <span className="text-white/80 font-medium">每周四 18:00</span>
        </p>
      </div>
    </aside>
  );
}
