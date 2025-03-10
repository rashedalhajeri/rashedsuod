
import React from "react";
import { 
  TrendingUp, ShoppingBag, Sparkles, Percent, 
  Tag, LayoutGrid, Star, Clock, Heart
} from "lucide-react";
import { SectionType } from "./types";

// Define section types with enhanced descriptions
export const sectionTypes: SectionType[] = [
  {
    id: 'best_selling',
    name: 'الأكثر مبيعاً',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'يعرض المنتجات الأكثر شراءً من قبل العملاء تلقائياً (حتى 25 منتج)',
    color: 'emerald'
  },
  {
    id: 'new_arrivals',
    name: 'وصل حديثاً',
    icon: <ShoppingBag className="h-5 w-5" />,
    description: 'يعرض آخر المنتجات المضافة للمتجر تلقائياً (حتى 25 منتج)',
    color: 'blue'
  },
  {
    id: 'featured',
    name: 'منتجات مميزة',
    icon: <Star className="h-5 w-5" />,
    description: 'يعرض المنتجات المميزة التي تم تحديدها في المتجر (حتى 25 منتج)',
    color: 'amber'
  },
  {
    id: 'on_sale',
    name: 'تخفيضات',
    icon: <Percent className="h-5 w-5" />,
    description: 'يعرض المنتجات التي تحتوي على خصومات وتخفيضات (حتى 25 منتج)',
    color: 'rose'
  },
  {
    id: 'category',
    name: 'فئة محددة',
    icon: <Tag className="h-5 w-5" />,
    description: 'يعرض منتجات من فئة محددة من اختيارك (حتى 25 منتج)',
    color: 'purple'
  },
  {
    id: 'custom',
    name: 'مخصص',
    icon: <LayoutGrid className="h-5 w-5" />,
    description: 'قسم مخصص من منتجات أو فئة تختارها أنت بنفسك',
    color: 'indigo'
  }
];
