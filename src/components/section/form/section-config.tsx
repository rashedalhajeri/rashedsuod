
import React from "react";
import { 
  Award, ShoppingBag, Star, BadgePercent, 
  PackageSearch, TrendingUp, Gift
} from "lucide-react";
import { SectionType } from "./types";

// Define section types with enhanced descriptions
export const sectionTypes: SectionType[] = [
  {
    id: 'best_selling',
    name: 'الأكثر مبيعاً',
    icon: <Award className="h-5 w-5" />,
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
    icon: <BadgePercent className="h-5 w-5" />,
    description: 'يعرض المنتجات التي تحتوي على خصومات وتخفيضات (حتى 25 منتج)',
    color: 'rose'
  },
  {
    id: 'all_products',
    name: 'جميع المنتجات',
    icon: <PackageSearch className="h-5 w-5" />,
    description: 'يعرض جميع المنتجات المتوفرة في المتجر',
    color: 'gray'
  },
  {
    id: 'trending',
    name: 'الأكثر رواجاً',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'يعرض المنتجات الأكثر مشاهدة وتفاعلاً (حتى 25 منتج)',
    color: 'indigo'
  }
];
