export interface Store {
  id: string;
  name: string;
  manager: string;
  city: string;
  badgeColor: string;
}

export interface Material {
  id: string;
  name: string;
  spec: string;
  category: "儿牙" | "正畸" | "修复" | "消毒" | "影像" | "基础";
  unit: string;
}

export type Urgency = "normal" | "urgent" | "critical";
export type DemandStatus =
  | "draft"
  | "submitted"
  | "merged"
  | "approved"
  | "delivering"
  | "received";

export interface Demand {
  id: string;
  storeId: string;
  materialId: string;
  week: string;
  quantity: number;
  urgency: Urgency;
  reason: string;
  status: DemandStatus;
  mergedOrderId?: string;
  expectedArrival?: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  totalOrders: number;
}

export interface SupplierPrice {
  id: string;
  supplierId: string;
  materialId: string;
  price: number;
  deliveryDays: number;
  moq: number;
  remark?: string;
}

export type Decision = "order_now" | "next_week" | "hold" | "pending";

export interface MergedOrder {
  id: string;
  materialId: string;
  demandIds: string[];
  totalQuantity: number;
  supplierId?: string;
  decision: Decision;
  finalPrice?: number;
  createDate: string;
  expectedArrival?: string;
}

export type UserRole = "hq" | "branch";
