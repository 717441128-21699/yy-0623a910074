import type { Demand, MergedOrder } from "@/types";
import { getCurrentWeek, addDaysFromNow, genId } from "@/utils/date";

const CURRENT_WEEK = getCurrentWeek();

export const INITIAL_DEMANDS: Demand[] = [
  { id: "d001", storeId: "s01", materialId: "m01", week: CURRENT_WEEK, quantity: 15, urgency: "urgent", reason: "儿牙涂氟剂低库存", status: "submitted" },
  { id: "d002", storeId: "s01", materialId: "m09", week: CURRENT_WEEK, quantity: 12, urgency: "normal", reason: "日常补充", status: "submitted" },
  { id: "d003", storeId: "s01", materialId: "m12", week: CURRENT_WEEK, quantity: 30, urgency: "critical", reason: "下周预计接诊高峰", status: "submitted" },
  { id: "d004", storeId: "s01", materialId: "m08", week: CURRENT_WEEK, quantity: 200, urgency: "normal", reason: "扫描头保护套消耗快", status: "merged", mergedOrderId: "mo01" },
  { id: "d005", storeId: "s01", materialId: "m03", week: CURRENT_WEEK, quantity: 40, urgency: "urgent", reason: "正畸橡皮圈新增颜色", status: "merged", mergedOrderId: "mo02" },

  { id: "d006", storeId: "s02", materialId: "m01", week: CURRENT_WEEK, quantity: 12, urgency: "normal", reason: "库存告急", status: "submitted" },
  { id: "d007", storeId: "s02", materialId: "m06", week: CURRENT_WEEK, quantity: 18, urgency: "urgent", reason: "藻酸盐低库存", status: "merged", mergedOrderId: "mo03" },
  { id: "d008", storeId: "s02", materialId: "m08", week: CURRENT_WEEK, quantity: 150, urgency: "urgent", reason: "新设备启用耗材增加", status: "merged", mergedOrderId: "mo01" },
  { id: "d009", storeId: "s02", materialId: "m03", week: CURRENT_WEEK, quantity: 25, urgency: "normal", reason: "常规补充", status: "merged", mergedOrderId: "mo02" },
  { id: "d010", storeId: "s02", materialId: "m10", week: CURRENT_WEEK, quantity: 8, urgency: "normal", reason: "大规格灭菌袋缺", status: "submitted" },

  { id: "d011", storeId: "s03", materialId: "m06", week: CURRENT_WEEK, quantity: 22, urgency: "critical", reason: "本周印模量大", status: "merged", mergedOrderId: "mo03" },
  { id: "d012", storeId: "s03", materialId: "m08", week: CURRENT_WEEK, quantity: 180, urgency: "normal", reason: "数字化接诊增加", status: "merged", mergedOrderId: "mo01" },
  { id: "d013", storeId: "s03", materialId: "m04", week: CURRENT_WEEK, quantity: 6, urgency: "normal", reason: "正畸新患者增加", status: "submitted" },
  { id: "d014", storeId: "s03", materialId: "m12", week: CURRENT_WEEK, quantity: 25, urgency: "urgent", reason: "丁腈手套消耗快", status: "submitted" },
  { id: "d015", storeId: "s03", materialId: "m13", week: CURRENT_WEEK, quantity: 10, urgency: "normal", reason: "树脂A2色补库", status: "submitted" },

  { id: "d016", storeId: "s04", materialId: "m03", week: CURRENT_WEEK, quantity: 35, urgency: "urgent", reason: "青少年正畸高峰", status: "merged", mergedOrderId: "mo02" },
  { id: "d017", storeId: "s04", materialId: "m06", week: CURRENT_WEEK, quantity: 14, urgency: "normal", reason: "藻酸盐日常补", status: "merged", mergedOrderId: "mo03" },
  { id: "d018", storeId: "s04", materialId: "m09", week: CURRENT_WEEK, quantity: 15, urgency: "urgent", reason: "灭菌袋小规格缺货", status: "submitted" },
  { id: "d019", storeId: "s04", materialId: "m08", week: CURRENT_WEEK, quantity: 120, urgency: "normal", reason: "常规备货", status: "merged", mergedOrderId: "mo01" },
  { id: "d020", storeId: "s04", materialId: "m05", week: CURRENT_WEEK, quantity: 30, urgency: "normal", reason: "弓丝耗量大", status: "submitted" },

  { id: "d021", storeId: "s05", materialId: "m01", week: CURRENT_WEEK, quantity: 20, urgency: "critical", reason: "涂氟公益活动备货", status: "submitted" },
  { id: "d022", storeId: "s05", materialId: "m02", week: CURRENT_WEEK, quantity: 18, urgency: "urgent", reason: "儿童护牙素缺", status: "submitted" },
  { id: "d023", storeId: "s05", materialId: "m11", week: CURRENT_WEEK, quantity: 60, urgency: "normal", reason: "口罩季度备", status: "submitted" },
  { id: "d024", storeId: "s05", materialId: "m08", week: CURRENT_WEEK, quantity: 100, urgency: "normal", reason: "保护套补货", status: "merged", mergedOrderId: "mo01" },

  { id: "d025", storeId: "s06", materialId: "m07", week: CURRENT_WEEK, quantity: 5, urgency: "urgent", reason: "种植修复高峰", status: "submitted" },
  { id: "d026", storeId: "s06", materialId: "m10", week: CURRENT_WEEK, quantity: 10, urgency: "normal", reason: "大号灭菌袋补充", status: "submitted" },
  { id: "d027", storeId: "s06", materialId: "m03", week: CURRENT_WEEK, quantity: 20, urgency: "normal", reason: "橡皮圈彩色款", status: "merged", mergedOrderId: "mo02" },

  { id: "d028", storeId: "s07", materialId: "m12", week: CURRENT_WEEK, quantity: 22, urgency: "urgent", reason: "手套快用完了", status: "submitted" },
  { id: "d029", storeId: "s07", materialId: "m13", week: CURRENT_WEEK, quantity: 8, urgency: "normal", reason: "A2色树脂", status: "submitted" },
  { id: "d030", storeId: "s07", materialId: "m14", week: CURRENT_WEEK, quantity: 15, urgency: "normal", reason: "K锉耗材", status: "submitted" },

  { id: "d031", storeId: "s08", materialId: "m06", week: CURRENT_WEEK, quantity: 10, urgency: "normal", reason: "印模材补货", status: "merged", mergedOrderId: "mo03" },
  { id: "d032", storeId: "s08", materialId: "m09", week: CURRENT_WEEK, quantity: 8, urgency: "urgent", reason: "灭菌袋快没了", status: "submitted" },
  { id: "d033", storeId: "s08", materialId: "m15", week: CURRENT_WEEK, quantity: 20, urgency: "normal", reason: "口镜丢失补充", status: "submitted" },

  { id: "d034", storeId: "s09", materialId: "m17", week: CURRENT_WEEK, quantity: 15, urgency: "normal", reason: "吸唾管月补", status: "submitted" },
  { id: "d035", storeId: "s09", materialId: "m18", week: CURRENT_WEEK, quantity: 12, urgency: "normal", reason: "光固化灯套", status: "submitted" },
  { id: "d036", storeId: "s09", materialId: "m04", week: CURRENT_WEEK, quantity: 4, urgency: "normal", reason: "托槽备货", status: "submitted" },

  { id: "d037", storeId: "s10", materialId: "m19", week: CURRENT_WEEK, quantity: 25, urgency: "urgent", reason: "X线传感器套缺货", status: "submitted" },
  { id: "d038", storeId: "s10", materialId: "m05", week: CURRENT_WEEK, quantity: 40, urgency: "normal", reason: "弓丝补货", status: "submitted" },
  { id: "d039", storeId: "s10", materialId: "m08", week: CURRENT_WEEK, quantity: 90, urgency: "urgent", reason: "扫描仪保护套", status: "merged", mergedOrderId: "mo01" },

  { id: "d040", storeId: "s11", materialId: "m16", week: CURRENT_WEEK, quantity: 18, urgency: "normal", reason: "镊子补充", status: "submitted" },
  { id: "d041", storeId: "s11", materialId: "m20", week: CURRENT_WEEK, quantity: 10, urgency: "normal", reason: "咬合纸快用完", status: "submitted" },
  { id: "d042", storeId: "s11", materialId: "m06", week: CURRENT_WEEK, quantity: 8, urgency: "normal", reason: "藻酸盐月补", status: "merged", mergedOrderId: "mo03" },

  { id: "d043", storeId: "s12", materialId: "m11", week: CURRENT_WEEK, quantity: 45, urgency: "normal", reason: "口罩季度备货", status: "submitted" },
  { id: "d044", storeId: "s12", materialId: "m12", week: CURRENT_WEEK, quantity: 20, urgency: "urgent", reason: "丁腈手套快用完", status: "submitted" },
  { id: "d045", storeId: "s12", materialId: "m03", week: CURRENT_WEEK, quantity: 18, urgency: "normal", reason: "正畸橡皮圈补", status: "merged", mergedOrderId: "mo02" },
];

const today = new Date().toISOString();

export const INITIAL_MERGED_ORDERS: MergedOrder[] = [
  {
    id: "mo01",
    materialId: "m08",
    demandIds: ["d004", "d008", "d012", "d019", "d024", "d039"],
    totalQuantity: 840,
    supplierId: "sp04",
    decision: "order_now",
    finalPrice: 8232,
    createDate: today,
    expectedArrival: addDaysFromNow(1),
  },
  {
    id: "mo02",
    materialId: "m03",
    demandIds: ["d005", "d009", "d016", "d027", "d045"],
    totalQuantity: 138,
    decision: "pending",
    createDate: today,
  },
  {
    id: "mo03",
    materialId: "m06",
    demandIds: ["d007", "d011", "d017", "d031", "d042"],
    totalQuantity: 72,
    decision: "pending",
    createDate: today,
  },
];

export { genId };
