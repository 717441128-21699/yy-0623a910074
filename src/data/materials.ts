import type { Material } from "@/types";

export const MATERIALS: Material[] = [
  { id: "m01", name: "儿牙涂氟剂", spec: "3g/支·水果味", category: "儿牙", unit: "支" },
  { id: "m02", name: "儿童护牙素", spec: "50ml/支", category: "儿牙", unit: "支" },
  { id: "m03", name: "正畸橡皮圈", spec: "3.5oz·1/4英寸·彩色", category: "正畸", unit: "包" },
  { id: "m04", name: "正畸托槽", spec: "MBT·金属·0.022", category: "正畸", unit: "套" },
  { id: "m05", name: "正畸弓丝", spec: "NiTi·圆丝·0.014", category: "正畸", unit: "根" },
  { id: "m06", name: "藻酸盐印模材", spec: "454g/袋·快速凝固型", category: "修复", unit: "袋" },
  { id: "m07", name: "硅橡胶印模材", spec: "重体+轻体套装", category: "修复", unit: "套" },
  { id: "m08", name: "口内扫描头保护套", spec: "i500·一次性·灭菌", category: "影像", unit: "个" },
  { id: "m09", name: "灭菌袋", spec: "55×130mm·自封式·200片/盒", category: "消毒", unit: "盒" },
  { id: "m10", name: "灭菌袋", spec: "90×230mm·自封式·200片/盒", category: "消毒", unit: "盒" },
  { id: "m11", name: "一次性医用口罩", spec: "蓝色·三层·50只/盒", category: "基础", unit: "盒" },
  { id: "m12", name: "一次性丁腈手套", spec: "无粉·M号·100只/盒", category: "基础", unit: "盒" },
  { id: "m13", name: "牙科复合树脂", spec: "A2色·4g/支", category: "修复", unit: "支" },
  { id: "m14", name: "根管锉", spec: "K锉·25mm·#15", category: "修复", unit: "板" },
  { id: "m15", name: "口镜", spec: "不锈钢·4#·平面", category: "基础", unit: "支" },
  { id: "m16", name: "镊子", spec: "医用不锈钢·16cm", category: "基础", unit: "把" },
  { id: "m17", name: "吸唾管", spec: "一次性·弯型", category: "基础", unit: "包" },
  { id: "m18", name: "光固化灯保护套", spec: "透明·一次性", category: "基础", unit: "卷" },
  { id: "m19", name: "X线传感器套", spec: "口内·2号·灭菌", category: "影像", unit: "包" },
  { id: "m20", name: "咬合纸", spec: "蓝色·100μm·100张/盒", category: "修复", unit: "盒" },
];

export const MATERIAL_CATEGORIES = ["全部分类", "儿牙", "正畸", "修复", "消毒", "影像", "基础"] as const;
