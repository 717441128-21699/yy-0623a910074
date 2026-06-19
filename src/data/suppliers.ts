import type { Supplier, SupplierPrice } from "@/types";

export const SUPPLIERS: Supplier[] = [
  { id: "sp01", name: "华康医疗供应链", rating: 4.8, totalOrders: 1286 },
  { id: "sp02", name: "齿康医用耗材", rating: 4.6, totalOrders: 984 },
  { id: "sp03", name: "康泰医疗器械", rating: 4.5, totalOrders: 752 },
  { id: "sp04", name: "瑞尔口腔用品", rating: 4.7, totalOrders: 1102 },
  { id: "sp05", name: "安达医疗科技", rating: 4.3, totalOrders: 456 },
  { id: "sp06", name: "优供医械", rating: 4.9, totalOrders: 1540 },
];

export const SUPPLIER_PRICES: SupplierPrice[] = [
  { id: "p001", supplierId: "sp01", materialId: "m01", price: 58.0, deliveryDays: 3, moq: 10, remark: "冷链配送" },
  { id: "p002", supplierId: "sp04", materialId: "m01", price: 62.0, deliveryDays: 2, moq: 5, remark: "次日达·京仓" },
  { id: "p003", supplierId: "sp06", materialId: "m01", price: 52.5, deliveryDays: 4, moq: 20, remark: "整箱价优" },
  { id: "p004", supplierId: "sp02", materialId: "m01", price: 60.0, deliveryDays: 3, moq: 8, remark: "赠小样品" },

  { id: "p005", supplierId: "sp01", materialId: "m03", price: 18.0, deliveryDays: 2, moq: 30, remark: "颜色齐全" },
  { id: "p006", supplierId: "sp03", materialId: "m03", price: 15.5, deliveryDays: 4, moq: 50, remark: "批量价" },
  { id: "p007", supplierId: "sp05", materialId: "m03", price: 20.0, deliveryDays: 2, moq: 10, remark: "进口原料" },
  { id: "p008", supplierId: "sp06", materialId: "m03", price: 16.8, deliveryDays: 3, moq: 30, remark: "可定制颜色" },

  { id: "p009", supplierId: "sp02", materialId: "m06", price: 125.0, deliveryDays: 3, moq: 10, remark: "保质18个月" },
  { id: "p010", supplierId: "sp04", materialId: "m06", price: 138.0, deliveryDays: 2, moq: 5, remark: "进口品质" },
  { id: "p011", supplierId: "sp06", materialId: "m06", price: 110.0, deliveryDays: 4, moq: 20, remark: "现货充足" },
  { id: "p012", supplierId: "sp01", materialId: "m06", price: 118.0, deliveryDays: 3, moq: 12, remark: "免费试样" },

  { id: "p013", supplierId: "sp03", materialId: "m08", price: 8.5, deliveryDays: 2, moq: 100, remark: "i500专用" },
  { id: "p014", supplierId: "sp04", materialId: "m08", price: 9.8, deliveryDays: 1, moq: 50, remark: "灭菌·现货" },
  { id: "p015", supplierId: "sp01", materialId: "m08", price: 7.2, deliveryDays: 3, moq: 200, remark: "整箱2000个" },
  { id: "p016", supplierId: "sp05", materialId: "m08", price: 8.0, deliveryDays: 3, moq: 100, remark: "通用兼容" },

  { id: "p017", supplierId: "sp01", materialId: "m09", price: 42.0, deliveryDays: 2, moq: 20, remark: "200片装" },
  { id: "p018", supplierId: "sp02", materialId: "m09", price: 38.0, deliveryDays: 3, moq: 30, remark: "加厚型" },
  { id: "p019", supplierId: "sp06", materialId: "m09", price: 35.5, deliveryDays: 4, moq: 50, remark: "整箱价" },
  { id: "p020", supplierId: "sp04", materialId: "m09", price: 45.0, deliveryDays: 2, moq: 10, remark: "易撕口" },

  { id: "p021", supplierId: "sp06", materialId: "m10", price: 58.0, deliveryDays: 3, moq: 20, remark: "大尺寸" },
  { id: "p022", supplierId: "sp01", materialId: "m10", price: 55.0, deliveryDays: 3, moq: 25, remark: "加厚" },
  { id: "p023", supplierId: "sp03", materialId: "m10", price: 62.0, deliveryDays: 2, moq: 10, remark: "现货" },

  { id: "p024", supplierId: "sp02", materialId: "m12", price: 85.0, deliveryDays: 2, moq: 20, remark: "无粉·可接触口腔" },
  { id: "p025", supplierId: "sp06", materialId: "m12", price: 78.0, deliveryDays: 3, moq: 30, remark: "蓝色·100只" },
  { id: "p026", supplierId: "sp04", materialId: "m12", price: 92.0, deliveryDays: 1, moq: 10, remark: "进口·加厚" },

  { id: "p027", supplierId: "sp04", materialId: "m13", price: 198.0, deliveryDays: 2, moq: 5, remark: "光固化复合树脂" },
  { id: "p028", supplierId: "sp01", materialId: "m13", price: 185.0, deliveryDays: 3, moq: 10, remark: "A2热销色" },
  { id: "p029", supplierId: "sp02", materialId: "m13", price: 215.0, deliveryDays: 2, moq: 3, remark: "高端系列" },

  { id: "p030", supplierId: "sp01", materialId: "m04", price: 320.0, deliveryDays: 3, moq: 5, remark: "MBT标准型" },
  { id: "p031", supplierId: "sp03", materialId: "m04", price: 380.0, deliveryDays: 4, moq: 3, remark: "进口材质" },
  { id: "p032", supplierId: "sp06", materialId: "m04", price: 295.0, deliveryDays: 4, moq: 10, remark: "厂家直供" },

  { id: "p033", supplierId: "sp02", materialId: "m05", price: 28.0, deliveryDays: 2, moq: 20, remark: "10根/包" },
  { id: "p034", supplierId: "sp06", materialId: "m05", price: 25.0, deliveryDays: 3, moq: 30, remark: "超弹NiTi" },
  { id: "p035", supplierId: "sp01", materialId: "m05", price: 32.0, deliveryDays: 2, moq: 15, remark: "进口丝材" },

  { id: "p036", supplierId: "sp01", materialId: "m07", price: 520.0, deliveryDays: 3, moq: 3, remark: "重体+轻体套装" },
  { id: "p037", supplierId: "sp04", materialId: "m07", price: 585.0, deliveryDays: 2, moq: 2, remark: "高精度·低收缩" },

  { id: "p038", supplierId: "sp06", materialId: "m02", price: 68.0, deliveryDays: 3, moq: 15, remark: "儿童护牙素" },
  { id: "p039", supplierId: "sp02", materialId: "m02", price: 75.0, deliveryDays: 2, moq: 8, remark: "水果味" },
  { id: "p040", supplierId: "sp04", materialId: "m02", price: 82.0, deliveryDays: 2, moq: 5, remark: "含氟配方" },

  { id: "p041", supplierId: "sp01", materialId: "m11", price: 22.0, deliveryDays: 1, moq: 50, remark: "50只/盒" },
  { id: "p042", supplierId: "sp06", materialId: "m11", price: 18.5, deliveryDays: 2, moq: 100, remark: "整箱60盒" },
  { id: "p043", supplierId: "sp03", materialId: "m11", price: 25.0, deliveryDays: 2, moq: 20, remark: "加厚型" },

  { id: "p044", supplierId: "sp04", materialId: "m14", price: 45.0, deliveryDays: 2, moq: 10, remark: "6支/板" },
  { id: "p045", supplierId: "sp01", materialId: "m14", price: 52.0, deliveryDays: 3, moq: 8, remark: "不锈钢K锉" },

  { id: "p046", supplierId: "sp02", materialId: "m15", price: 18.0, deliveryDays: 2, moq: 30, remark: "医用级" },
  { id: "p047", supplierId: "sp06", materialId: "m15", price: 15.5, deliveryDays: 3, moq: 50, remark: "整包12支" },

  { id: "p048", supplierId: "sp01", materialId: "m16", price: 25.0, deliveryDays: 2, moq: 20, remark: "镊子16cm" },
  { id: "p049", supplierId: "sp03", materialId: "m16", price: 22.0, deliveryDays: 3, moq: 25, remark: "防滑纹" },

  { id: "p050", supplierId: "sp06", materialId: "m17", price: 32.0, deliveryDays: 2, moq: 30, remark: "100支/包" },
  { id: "p051", supplierId: "sp02", materialId: "m17", price: 28.5, deliveryDays: 3, moq: 40, remark: "吸唾管" },

  { id: "p052", supplierId: "sp01", materialId: "m18", price: 55.0, deliveryDays: 2, moq: 20, remark: "50米/卷" },
  { id: "p053", supplierId: "sp04", materialId: "m18", price: 62.0, deliveryDays: 2, moq: 10, remark: "加厚透明" },

  { id: "p054", supplierId: "sp03", materialId: "m19", price: 88.0, deliveryDays: 3, moq: 15, remark: "2号传感器套" },
  { id: "p055", supplierId: "sp06", materialId: "m19", price: 78.0, deliveryDays: 3, moq: 20, remark: "灭菌包装" },

  { id: "p056", supplierId: "sp02", materialId: "m20", price: 38.0, deliveryDays: 2, moq: 20, remark: "蓝色咬合纸" },
  { id: "p057", supplierId: "sp01", materialId: "m20", price: 42.0, deliveryDays: 3, moq: 15, remark: "超薄100μm" },
];
