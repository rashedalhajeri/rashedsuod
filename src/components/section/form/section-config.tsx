
import React from "react";
import { 
  BanknoteIcon, ShoppingBag, Sparkles, Percent, 
  Tag, LayoutGrid 
} from "lucide-react";
import { SectionType } from "./types";

// Define section types
export const sectionTypes: SectionType[] = [
  {
    id: 'best_selling',
    name: 'الأكثر مبيعاً',
    icon: <BanknoteIcon className="h-5 w-5 text-emerald-500" />,
    description: 'يعرض المنتجات الأكثر مبيعاً في متجرك',
    color: 'emerald'
  },
  {
    id: 'new_arrivals',
    name: 'وصل حديثاً',
    icon: <ShoppingBag className="h-5 w-5 text-blue-500" />,
    description: 'يعرض أحدث المنتجات التي تمت إضافتها',
    color: 'blue'
  },
  {
    id: 'featured',
    name: 'منتجات مميزة',
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    description: 'يعرض المنتجات المميزة في متجرك',
    color: 'amber'
  },
  {
    id: 'on_sale',
    name: 'تخفيضات',
    icon: <Percent className="h-5 w-5 text-rose-500" />,
    description: 'يعرض المنتجات التي عليها خصومات',
    color: 'rose'
  },
  {
    id: 'category',
    name: 'فئة محددة',
    icon: <Tag className="h-5 w-5 text-purple-500" />,
    description: 'يعرض منتجات من فئة محددة',
    color: 'purple'
  },
  {
    id: 'custom',
    name: 'مخصص',
    icon: <LayoutGrid className="h-5 w-5 text-indigo-500" />,
    description: 'قسم مخصص من اختيارك',
    color: 'indigo'
  }
];
