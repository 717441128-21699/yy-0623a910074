import { useNavigate } from "react-router-dom";
import { Building2, ChevronDown, Settings, Bell, UserCircle2 } from "lucide-react";
import { useProcurementStore } from "@/store/useProcurementStore";
import type { UserRole } from "@/types";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const { currentRole, currentStoreId, setRole, setCurrentStore, stores, getStoreById } =
    useProcurementStore();
  const [roleOpen, setRoleOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);

  const currentStore = getStoreById(currentStoreId);
  const hqCount = stores.filter((s) => s.city).length;

  return (
    <header className="sticky top-0 z-40 h-17 px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="font-serif text-lg font-semibold text-brand-700 tracking-tight">
              优齿集采
            </h1>
            <p className="text-[11px] text-slate-500">
              连锁口腔 · 集中订货台 {hqCount}家门店
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setRoleOpen(!roleOpen);
              setStoreOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-sm"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                currentRole === "hq" ? "bg-accent-500" : "bg-warn-500"
              }`}
            />
            <span className="text-slate-700 font-medium">
              {currentRole === "hq" ? "总部采购主管" : "分院负责人"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          {roleOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-fade-in z-50">
              {(["hq", "branch"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setRoleOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-slate-50 ${
                    currentRole === r ? "bg-brand-50 text-brand-700" : "text-slate-700"
                  }`}
                >
                  <span>{r === "hq" ? "总部采购主管" : "分院负责人"}</span>
                  {currentRole === r && (
                    <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">
                      当前
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              if (currentRole === "branch") {
                setStoreOpen(!storeOpen);
                setRoleOpen(false);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm ${
              currentRole === "branch"
                ? "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50"
                : "border-slate-100 bg-slate-50 text-slate-400 cursor-default"
            }`}
            disabled={currentRole === "hq"}
          >
            {currentStore && (
              <div className={`w-6 h-6 rounded-full ${currentStore.badgeColor} flex items-center justify-center text-white text-[11px] font-bold`}>
                {currentStore.name.charAt(5)}
              </div>
            )}
            <span className={`font-medium ${currentRole === "hq" ? "" : "text-slate-700"}`}>
              {currentRole === "hq" ? "管理全部门店" : currentStore?.name.slice(0, 12)}
            </span>
            {currentRole === "branch" && <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {storeOpen && currentRole === "branch" && (
            <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg animate-fade-in z-50">
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStore(s.id);
                    setStoreOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 ${
                    currentStoreId === s.id ? "bg-brand-50" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${s.badgeColor} flex items-center justify-center text-white text-xs font-bold`}>
                    {s.name.charAt(5)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">{s.name}</div>
                    <div className="text-xs text-slate-500">
                      {s.city} · 负责人 {s.manager}
                    </div>
                  </div>
                  {currentStoreId === s.id && (
                    <span className="text-[10px] bg-accent-500 text-white px-2 py-0.5 rounded-full">
                      选中
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500" />
        </button>

        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <UserCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm leading-tight hidden lg:block">
            <div className="text-slate-800 font-medium">
              {currentRole === "hq" ? "陈采购" : currentStore?.manager}
            </div>
            <div className="text-[11px] text-slate-500">
              {currentRole === "hq" ? "采购部 · 主管" : `${currentStore?.city}分院`}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
