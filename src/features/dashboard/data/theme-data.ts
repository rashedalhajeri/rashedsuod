
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
    },
    layout: {
      type: 'grid',
      productsPerRow: 3,
      spacing: 'comfortable'
    },
    styles: {
      button: 'soft',
      image: 'rounded',
      header: 'centered',
      footer: 'simple'
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
    },
    layout: {
      type: 'cards',
      productsPerRow: 3,
      spacing: 'comfortable'
    },
    styles: {
      button: 'rounded',
      image: 'rounded',
      header: 'logo-left',
      footer: 'detailed'
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
    },
    layout: {
      type: 'grid',
      productsPerRow: 4,
      spacing: 'spacious'
    },
    styles: {
      button: 'square',
      image: 'square',
      header: 'centered',
      footer: 'minimal'
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
    },
    layout: {
      type: 'list',
      productsPerRow: 1,
      spacing: 'comfortable'
    },
    styles: {
      button: 'soft',
      image: 'square',
      header: 'logo-right',
      footer: 'detailed'
    }
  },
  {
    id: 'colorful',
    name: 'ملون وحيوي',
    description: 'تصميم نابض بالحياة مع ألوان متعددة تجذب انتباه العملاء',
    preview: '/themes/colorful.jpg',
    isPremium: false,
    colors: {
      primary: '#FF9671',
      secondary: '#FFC75F',
      accent: '#F9F871',
    },
    layout: {
      type: 'magazine',
      productsPerRow: 3,
      spacing: 'comfortable'
    },
    styles: {
      button: 'rounded',
      image: 'circle',
      header: 'centered',
      footer: 'simple'
    }
  },
  {
    id: 'elegant',
    name: 'راقي وفاخر',
    description: 'تصميم فاخر يناسب المنتجات الراقية والعلامات التجارية المميزة',
    preview: '/themes/elegant.jpg',
    isPremium: true,
    colors: {
      primary: '#845EC2',
      secondary: '#F8F7FE',
      accent: '#B39CD0',
    },
    layout: {
      type: 'cards',
      productsPerRow: 2,
      spacing: 'spacious'
    },
    styles: {
      button: 'soft',
      image: 'rounded',
      header: 'logo-left',
      footer: 'detailed'
    }
  },
  {
    id: 'compact',
    name: 'مدمج وعملي',
    description: 'تصميم مدمج يعرض أكبر قدر من المحتوى في مساحة صغيرة',
    preview: '/themes/compact.jpg',
    isPremium: true,
    colors: {
      primary: '#0D9488',
      secondary: '#E9FAF9',
      accent: '#5EEAD4',
    },
    layout: {
      type: 'grid',
      productsPerRow: 5,
      spacing: 'compact'
    },
    styles: {
      button: 'square',
      image: 'square',
      header: 'logo-right',
      footer: 'minimal'
    }
  },
  {
    id: 'dark-luxury',
    name: 'فاخر داكن',
    description: 'تصميم داكن اللون مع لمسات فاخرة مناسب للمنتجات الراقية',
    preview: '/themes/dark-luxury.jpg',
    isPremium: true,
    colors: {
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#F59E0B',
    },
    layout: {
      type: 'cards',
      productsPerRow: 3,
      spacing: 'comfortable'
    },
    styles: {
      button: 'soft',
      image: 'rounded',
      header: 'centered',
      footer: 'detailed'
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
  { name: 'ذهبي', value: '#D4AF37' },
  { name: 'فضي', value: '#C0C0C0' },
  { name: 'نحاسي', value: '#B87333' },
  { name: 'تركواز', value: '#40E0D0' },
  { name: 'أرجواني', value: '#7B1FA2' },
  { name: 'أزرق فاتح', value: '#38BDF8' },
  { name: 'زيتوني', value: '#556B2F' },
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
  { name: 'كريمي', value: '#FFFDD0' },
  { name: 'بيج فاتح', value: '#F5F5DC' },
  { name: 'رمادي دافئ', value: '#F4F4F6' },
  { name: 'أزرق سماوي', value: '#E0F7FA' },
  { name: 'وردي باستيل', value: '#FADADD' },
  { name: 'أخضر نعناعي', value: '#F1FFEB' },
  { name: 'رملي', value: '#F6F1E3' },
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
  { name: 'ذهبي لامع', value: '#FFD700' },
  { name: 'فيروزي', value: '#4FD1C5' },
  { name: 'زمردي', value: '#10B981' },
  { name: 'كوبالت', value: '#3B82F6' },
  { name: 'برونزي', value: '#CD7F32' },
  { name: 'بنفسجي زاهي', value: '#9333EA' },
  { name: 'كورال', value: '#FF6F61' },
  { name: 'فوشيا', value: '#DE3163' },
];

export const fontOptions: FontOption[] = [
  { name: 'افتراضي', value: 'default' },
  { name: 'القاهرة', value: 'cairo' },
  { name: 'تجول', value: 'tajawal' },
  { name: 'المراعي', value: 'almarai' },
  { name: 'تشانجا', value: 'changa' },
  { name: 'ريم كوفي', value: 'reem-kufi' },
];
