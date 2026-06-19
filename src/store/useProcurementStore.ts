import { create } from "zustand";
import type {
  Store,
  Material,
  Demand,
  Supplier,
  SupplierPrice,
  MergedOrder,
  Urgency,
  UserRole,
  Decision,
} from "@/types";
import { STORES } from "@/data/stores";
import { MATERIALS } from "@/data/materials";
import { SUPPLIERS, SUPPLIER_PRICES } from "@/data/suppliers";
import { INITIAL_DEMANDS, INITIAL_MERGED_ORDERS } from "@/data/demands";
import { getCurrentWeek, addDaysFromNow, formatDate, genId } from "@/utils/date";

interface ProcurementState {
  stores: Store[];
  materials: Material[];
  demands: Demand[];
  suppliers: Supplier[];
  supplierPrices: SupplierPrice[];
  mergedOrders: MergedOrder[];

  currentRole: UserRole;
  currentStoreId: string;
  currentWeek: string;
  selectedMaterialForCompare: string | null;

  setRole: (role: UserRole) => void;
  setCurrentStore: (id: string) => void;
  setSelectedMaterialForCompare: (id: string | null) => void;

  addDemand: (d: Omit<Demand, "id" | "status" | "week">) => void;
  updateDemand: (id: string, patch: Partial<Demand>) => void;
  deleteDemand: (id: string) => void;
  submitWeekDemands: (storeId: string) => { success: boolean; failedIds: string[] };

  autoMergeDemands: () => MergedOrder[];
  createMergedOrder: (materialId: string, demandIds: string[]) => void;
  selectSupplier: (orderId: string, supplierId: string) => void;
  setDecision: (orderId: string, decision: Decision, deliveryDays?: number) => void;
  removeMergedOrder: (orderId: string) => void;

  getDemandsByStore: (storeId: string) => Demand[];
  getDemandsByMaterial: (materialId: string) => Demand[];
  getDemandsByWeek: (week: string) => Demand[];
  getUnmergedDemands: () => Demand[];
  getUrgentDemands: () => Demand[];
  getPricesForMaterial: (materialId: string) => (SupplierPrice & { supplier: Supplier })[];
  getStats: () => {
    total: number;
    pending: number;
    merged: number;
    ordered: number;
    hold: number;
    estimatedCost: number;
    urgentCount: number;
  };
  getStoreStats: (storeId: string) => {
    total: number;
    urgent: number;
    status: "未提交" | "待审" | "已审";
  };
  getMaterialById: (id: string) => Material | undefined;
  getStoreById: (id: string) => Store | undefined;
  getSupplierById: (id: string) => Supplier | undefined;
  getMergedOrdersByMaterial: (materialId: string) => MergedOrder[];
}

const STORAGE_KEY = "procurement_store_v1";

function loadFromStorage(): Partial<ProcurementState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistToFile(state: ProcurementState) {
  try {
    const toSave: Partial<ProcurementState> = {
      demands: state.demands,
      mergedOrders: state.mergedOrders,
      currentRole: state.currentRole,
      currentStoreId: state.currentStoreId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    /* ignore */
  }
}

const saved = loadFromStorage();

export const useProcurementStore = create<ProcurementState>((set, get) => ({
  stores: STORES,
  materials: MATERIALS,
  demands: saved?.demands ?? INITIAL_DEMANDS,
  suppliers: SUPPLIERS,
  supplierPrices: SUPPLIER_PRICES,
  mergedOrders: saved?.mergedOrders ?? INITIAL_MERGED_ORDERS,

  currentRole: saved?.currentRole ?? "hq",
  currentStoreId: saved?.currentStoreId ?? "s01",
  currentWeek: getCurrentWeek(),
  selectedMaterialForCompare: null,

  setRole: (role) => {
    set({ currentRole: role });
    persistToFile(get());
  },
  setCurrentStore: (id) => {
    set({ currentStoreId: id });
    persistToFile(get());
  },
  setSelectedMaterialForCompare: (id) => set({ selectedMaterialForCompare: id }),

  addDemand: (d) => {
    const state = get();
    const newDemand: Demand = {
      ...d,
      id: genId("d"),
      week: state.currentWeek,
      status: "draft",
    };
    set({ demands: [...state.demands, newDemand] });
    persistToFile(get());
  },
  updateDemand: (id, patch) => {
    const state = get();
    set({
      demands: state.demands.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
    persistToFile(get());
  },
  deleteDemand: (id) => {
    const state = get();
    set({ demands: state.demands.filter((d) => d.id !== id) });
    persistToFile(get());
  },
  submitWeekDemands: (storeId) => {
    const state = get();
    const weekDrafts = state.demands.filter(
      (d) =>
        d.storeId === storeId &&
        d.week === state.currentWeek &&
        d.status === "draft"
    );
    const invalid = weekDrafts.filter(
      (d) => !d.reason || d.reason.trim().length === 0
    );
    if (invalid.length > 0) {
      return { success: false, failedIds: invalid.map((d) => d.id) };
    }
    set({
      demands: state.demands.map((d) =>
        d.storeId === storeId &&
        d.week === state.currentWeek &&
        d.status === "draft"
          ? { ...d, status: "submitted" as const }
          : d
      ),
    });
    persistToFile(get());
    return { success: true, failedIds: [] };
  },

  autoMergeDemands: () => {
    const state = get();
    const validSubmitted = state.demands.filter(
      (d) =>
        d.status === "submitted" &&
        !d.mergedOrderId &&
        d.reason &&
        d.reason.trim().length > 0
    );
    const byMaterial = new Map<string, Demand[]>();
    for (const d of validSubmitted) {
      if (!byMaterial.has(d.materialId)) byMaterial.set(d.materialId, []);
      byMaterial.get(d.materialId)!.push(d);
    }

    const newOrders: MergedOrder[] = [];
    const today = formatDate(new Date());
    const updatedDemands = [...state.demands];

    for (const [matId, demList] of byMaterial) {
      if (demList.length < 2) continue;
      const hasPendingExisting = state.mergedOrders.some(
        (o) => o.materialId === matId && o.decision === "pending"
      );
      if (hasPendingExisting) continue;

      const demandIds = demList.map((d) => d.id);
      const totalQuantity = demList.reduce((s, d) => s + d.quantity, 0);

      newOrders.push({
        id: genId("mo"),
        materialId: matId,
        demandIds,
        totalQuantity,
        decision: "pending",
        createDate: today,
      });

      const newOrderId = newOrders[newOrders.length - 1].id;
      for (let i = 0; i < updatedDemands.length; i++) {
        if (demandIds.includes(updatedDemands[i].id)) {
          updatedDemands[i] = {
            ...updatedDemands[i],
            status: "merged",
            mergedOrderId: newOrderId,
          };
        }
      }
    }

    if (newOrders.length > 0) {
      set({
        mergedOrders: [...state.mergedOrders, ...newOrders],
        demands: updatedDemands,
      });
      persistToFile(get());
    }
    return get().mergedOrders;
  },

  createMergedOrder: (materialId, demandIds) => {
    const state = get();
    const total = state.demands
      .filter((d) => demandIds.includes(d.id))
      .reduce((s, d) => s + d.quantity, 0);
    const order: MergedOrder = {
      id: genId("mo"),
      materialId,
      demandIds,
      totalQuantity: total,
      decision: "pending",
      createDate: formatDate(new Date()),
    };
    set({
      mergedOrders: [...state.mergedOrders, order],
      demands: state.demands.map((d) =>
        demandIds.includes(d.id) ? { ...d, status: "merged", mergedOrderId: order.id } : d
      ),
    });
    persistToFile(get());
  },

  selectSupplier: (orderId, supplierId) => {
    const state = get();
    const order = state.mergedOrders.find((o) => o.id === orderId);
    if (!order) return;
    const price = state.supplierPrices.find(
      (p) => p.supplierId === supplierId && p.materialId === order.materialId
    );
    const finalPrice = price ? price.price * order.totalQuantity : undefined;
    set({
      mergedOrders: state.mergedOrders.map((o) =>
        o.id === orderId ? { ...o, supplierId, finalPrice } : o
      ),
    });
    persistToFile(get());
  },

  setDecision: (orderId, decision, deliveryDays) => {
    const state = get();
    const order = state.mergedOrders.find((o) => o.id === orderId);
    if (!order) return;

    let expectedArrival: string | undefined;
    let newDemandStatus: Demand["status"] = "approved";
    if (decision === "order_now") {
      const days = deliveryDays ?? 3;
      expectedArrival = addDaysFromNow(days);
      newDemandStatus = "delivering";
    } else if (decision === "next_week") {
      expectedArrival = addDaysFromNow(7 + (deliveryDays ?? 3));
      newDemandStatus = "approved";
    } else if (decision === "hold") {
      expectedArrival = undefined;
      newDemandStatus = "approved";
    } else if (decision === "pending") {
      expectedArrival = undefined;
      newDemandStatus = "merged";
    }

    set({
      mergedOrders: state.mergedOrders.map((o) =>
        o.id === orderId ? { ...o, decision, expectedArrival } : o
      ),
      demands: state.demands.map((d) =>
        order.demandIds.includes(d.id)
          ? {
              ...d,
              expectedArrival,
              status: newDemandStatus,
              decision: decision,
            }
          : d
      ),
    });
    persistToFile(get());
  },

  removeMergedOrder: (orderId) => {
    const state = get();
    set({
      mergedOrders: state.mergedOrders.filter((o) => o.id !== orderId),
      demands: state.demands.map((d) =>
        d.mergedOrderId === orderId
          ? { ...d, mergedOrderId: undefined, status: "submitted", decision: undefined, expectedArrival: undefined }
          : d
      ),
    });
    persistToFile(get());
  },

  getDemandsByStore: (storeId) => get().demands.filter((d) => d.storeId === storeId),
  getDemandsByMaterial: (materialId) => get().demands.filter((d) => d.materialId === materialId),
  getDemandsByWeek: (week) => get().demands.filter((d) => d.week === week),
  getUnmergedDemands: () =>
    get().demands.filter((d) => d.status === "submitted" && !d.mergedOrderId),
  getUrgentDemands: () =>
    get().demands.filter(
      (d) =>
        (d.urgency === "urgent" || d.urgency === "critical") &&
        d.reason &&
        d.reason.trim().length > 0
    ),

  getPricesForMaterial: (materialId) => {
    const state = get();
    return state.supplierPrices
      .filter((p) => p.materialId === materialId)
      .map((p) => ({
        ...p,
        supplier: state.suppliers.find((s) => s.id === p.supplierId)!,
      }));
  },

  getStats: () => {
    const state = get();
    const weekDemands = state.demands.filter((d) => d.week === state.currentWeek);
    const visibleDemands = weekDemands.filter(
      (d) =>
        d.status === "draft" || (d.reason && d.reason.trim().length > 0)
    );
    const total = visibleDemands.length;
    const pending = visibleDemands.filter((d) => d.status === "submitted").length;
    const merged = state.mergedOrders.filter((o) => o.decision === "pending").length;
    const ordered = state.mergedOrders.filter((o) => o.decision === "order_now").length;
    const hold = state.mergedOrders.filter((o) => o.decision === "hold").length;
    const urgentCount = visibleDemands.filter(
      (d) => d.urgency === "urgent" || d.urgency === "critical"
    ).length;
    let estimatedCost = 0;
    for (const o of state.mergedOrders) {
      if (o.finalPrice) estimatedCost += o.finalPrice;
      else {
        const prices = state.getPricesForMaterial(o.materialId);
        if (prices.length > 0) {
          const avg = prices.reduce((s, p) => s + p.price, 0) / prices.length;
          estimatedCost += avg * o.totalQuantity;
        }
      }
    }
    return { total, pending, merged, ordered, hold, estimatedCost, urgentCount };
  },

  getStoreStats: (storeId) => {
    const state = get();
    const allList = state.demands.filter(
      (d) => d.storeId === storeId && d.week === state.currentWeek
    );
    const list = allList.filter(
      (d) =>
        d.status === "draft" || (d.reason && d.reason.trim().length > 0)
    );
    const total = list.length;
    const urgent = list.filter((d) => d.urgency === "urgent" || d.urgency === "critical").length;
    const hasSubmitted = list.some((d) => d.status !== "draft");
    const allApproved = list.length > 0 && list.every((d) => d.status === "approved" || d.status === "delivering" || d.status === "received");
    let status: "未提交" | "待审" | "已审" = "未提交";
    if (total === 0) status = "未提交";
    else if (allApproved) status = "已审";
    else if (hasSubmitted) status = "待审";
    return { total, urgent, status };
  },

  getMaterialById: (id) => get().materials.find((m) => m.id === id),
  getStoreById: (id) => get().stores.find((s) => s.id === id),
  getSupplierById: (id) => get().suppliers.find((s) => s.id === id),
  getMergedOrdersByMaterial: (materialId) =>
    get().mergedOrders.filter((o) => o.materialId === materialId),
}));
