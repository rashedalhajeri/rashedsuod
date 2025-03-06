
import { ThemeOption, ColorOption, FontOption } from "../types/theme-types";

export const themes: ThemeOption[] = [
  {
    id: 'classic',
    name: 'كلاسيكي أنيق',
    description: 'تصميم أنيق وبسيط مع تركيز على عرض المنتجات بشكل جذاب',
    preview: '/themes/classic.jpg',
    isPremium: false,
    colors: {
      primary: '#2B6CB0',
      secondary: '#E2E8F0',
      accent: '#CBD5E0',
    }
  },
  {
    id: 'modern',
    name: 'عصري حديث',
    description: 'تصميم عصري مع ألوان زاهية وتأثيرات حركية بسيطة',
    preview: '/themes/modern.jpg',
    isPremium: false,
    colors: {
      primary: '#805AD5',
      secondary: '#E9D8FD',
      accent: '#D6BCFA',
    }
  },
  {
    id: 'minimal',
    name: 'مينمال بسيط',
    description: 'تصميم بسيط وأنيق مع مساحات بيضاء ومحتوى مركز',
    preview: '/themes/minimal.jpg',
    isPremium: false,
    colors: {
      primary: '#1A202C',
      secondary: '#EDF2F7',
      accent: '#E2E8F0',
    }
  },
  {
    id: 'business',
    name: 'تجاري احترافي',
    description: 'تصميم احترافي يناسب المتاجر الكبيرة والشركات التجارية',
    preview: '/themes/business.jpg',
    isPremium: false,
    colors: {
      primary: '#2D3748',
      secondary: '#EDF2F7',
      accent: '#4299E1',
    }
  },
  {
    id: 'colorful',
    name: 'ملون وحيوي',
    description: 'تصميم نابض بالحياة مع ألوان متعددة تجذب انتباه العملاء',
    preview: 'https://via.placeholder.com/400x300/FF9671/FFFFFF?text=Colorful+Theme',
    isPremium: false,
    colors: {
      primary: '#FF9671',
      secondary: '#FFC75F',
      accent: '#F9F871',
    }
  },
  {
    id: 'elegant',
    name: 'راقي وفاخر',
    description: 'تصميم فاخر يناسب المنتجات الراقية والعلامات التجارية المميزة',
    preview: 'https://via.placeholder.com/400x300/845EC2/FFFFFF?text=Elegant+Theme',
    isPremium: false,
    colors: {
      primary: '#845EC2',
      secondary: '#B39CD0',
      accent: '#FBEAFF',
    }
  },
];

export const colorOptions: ColorOption[] = [
  { name: 'أخضر', value: '#22C55E' },
  { name: 'أزرق', value: '#3B82F6' },
  { name: 'أحمر', value: '#EF4444' },
  { name: 'بنفسجي', value: '#8B5CF6' },
  { name: 'برتقالي', value: '#F59E0B' },
  { name: 'وردي', value: '#EC4899' },
  { name: 'أسود', value: '#0D0D0D' },
  { name: 'رمادي', value: '#71717A' },
  { name: 'أزرق داكن', value: '#1E40AF' },
  { name: 'أحمر داكن', value: '#B91C1C' },
  { name: 'أخضر داكن', value: '#15803D' },
];

export const secondaryColorOptions: ColorOption[] = [
  { name: 'رمادي فاتح', value: '#E2E8F0' },
  { name: 'أزرق فاتح', value: '#DBEAFE' },
  { name: 'أحمر فاتح', value: '#FEE2E2' },
  { name: 'بنفسجي فاتح', value: '#F3E8FF' },
  { name: 'أصفر فاتح', value: '#FEF3C7' },
  { name: 'وردي فاتح', value: '#FCE7F3' },
  { name: 'أخضر فاتح', value: '#DCFCE7' },
  { name: 'برتقالي فاتح', value: '#FFEDD5' },
  { name: 'أبيض', value: '#FFFFFF' },
];

export const accentColorOptions: ColorOption[] = [
  { name: 'رمادي متوسط', value: '#CBD5E0' },
  { name: 'أزرق متوسط', value: '#93C5FD' },
  { name: 'أحمر متوسط', value: '#FCA5A5' },
  { name: 'بنفسجي متوسط', value: '#D8B4FE' },
  { name: 'أصفر متوسط', value: '#FDE68A' },
  { name: 'وردي متوسط', value: '#F9A8D4' },
  { name: 'أخضر متوسط', value: '#86EFAC' },
  { name: 'برتقالي متوسط', value: '#FDBA74' },
];

export const fontOptions: FontOption[] = [
  { name: 'افتراضي', value: 'default' },
  { name: 'عصري', value: 'modern' },
  { name: 'كلاسيكي', value: 'classic' },
  { name: 'خفيف', value: 'light' },
  { name: 'ثقيل', value: 'bold' },
];
