
import { 
  ShoppingBag, Home, Package, BarChart, Users, Bell, Tag, CreditCard, Store, Percent, Crown, Layers, 
  LayoutDashboard, Star, Mail, MailQuestion, MessageSquare, PieChart, DollarSign,
  Truck, ClipboardList, Wallet, Receipt, Banknote, Activity, TrendingUp,
  Inbox, CalendarRange, Table, FileText, Image, LineChart, Wrench, Gift, 
  Database, ExternalLink, UserCog, HeartHandshake, ShieldCheck, BadgeDollarSign
} from "lucide-react";

// Main navigation items
export const mainNavigation = [
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'نظرة عامة على المبيعات والإحصائيات'
  }, 
  {
    name: 'الطلبات',
    href: '/dashboard/orders',
    icon: ShoppingBag,
    description: 'إدارة طلبات العملاء وت��بع الشحنات'
  },
  {
    name: 'المنتجات',
    href: '/dashboard/products',
    icon: Package,
    description: 'إدارة منتجات المتجر والمخزون'
  },
  {
    name: 'العملاء',
    href: '/dashboard/customers',
    icon: Users,
    description: 'إدارة قاعدة العملاء والولاء'
  }
];

// Marketing and sales navigation items
export const marketingSalesNavigation = [
  {
    name: 'العروض والخصومات',
    href: '/dashboard/promotions',
    icon: Percent,
    description: 'إدارة العروض الخاصة والتخفيضات'
  },
  {
    name: 'كوبونات الخصم',
    href: '/dashboard/coupons',
    icon: Gift,
    description: 'إنشاء وإدارة كوبونات الخصم'
  },
  {
    name: 'الفئات',
    href: '/dashboard/categories',
    icon: Layers,
    description: 'تنظيم المنتجات في فئات وتصنيفات'
  },
  {
    name: 'المدفوعات',
    href: '/dashboard/payment',
    icon: CreditCard,
    description: 'إعدادات طرق الدفع والمعاملات المالية'
  },
  {
    name: 'الشحن والتوصيل',
    href: '/dashboard/shipping',
    icon: Truck,
    description: 'إدارة خيارات الشحن وأسعار التوصيل'
  }
];

// Analytics navigation items
export const analyticsNavigation = [
  {
    name: 'تقارير المبيعات',
    href: '/dashboard/sales-reports',
    icon: BarChart,
    description: 'تحليل أداء المبيعات والإيرادات'
  },
  {
    name: 'أداء المنتجات',
    href: '/dashboard/product-analytics',
    icon: LineChart,
    description: 'إحصائيات حول أداء المنتجات'
  },
  {
    name: 'تحليل العملاء',
    href: '/dashboard/customer-analytics',
    icon: PieChart,
    description: 'بيانات عن سلوك العملاء والمشتريات'
  },
  {
    name: 'التدفق المالي',
    href: '/dashboard/financial',
    icon: TrendingUp,
    description: 'تقارير الإيرادات والمصروفات'
  }
];

// Communication navigation items
export const communicationNavigation = [
  {
    name: 'صندوق الوارد',
    href: '/dashboard/inbox',
    icon: Inbox,
    description: 'الرسائل الواردة من العملاء'
  },
  {
    name: 'استفسارات المنتجات',
    href: '/dashboard/product-inquiries',
    icon: MailQuestion,
    description: 'الرد على استفسارات حول المنتجات'
  },
  {
    name: 'الدعم الفني',
    href: '/dashboard/support',
    icon: HeartHandshake,
    description: 'تذاكر وطلبات الدعم الفني'
  },
  {
    name: 'التقييمات',
    href: '/dashboard/reviews',
    icon: Star,
    description: 'تقييمات العملاء والمراجعات'
  }
];

// Settings navigation items
export const settingsNavigation = [
  {
    name: 'معلومات المتجر',
    href: '/dashboard/store-info',
    icon: Store,
    description: 'البيانات الأساسية للمتجر وشعاره'
  },
  {
    name: 'تخصيص الواجهة',
    href: '/dashboard/appearance',
    icon: Image,
    description: 'تخصيص مظهر المتجر والألوان والقوالب'
  },
  {
    name: 'إعدادات النظام',
    href: '/dashboard/system-settings',
    icon: Wrench,
    description: 'إعدادات النظام والوظائف المتقدمة'
  },
  {
    name: 'الاشتراك والباقة',
    href: '/dashboard/subscription',
    icon: BadgeDollarSign,
    description: 'تفاصيل الاشتراك وخيارات الترقية'
  },
  {
    name: 'إدارة المستخدمين',
    href: '/dashboard/user-management',
    icon: UserCog,
    description: 'إضافة وإدارة فريق العمل والصلاحيات'
  },
  {
    name: 'الأمان والخصوصية',
    href: '/dashboard/security',
    icon: ShieldCheck,
    description: 'إعدادات الأمان وحماية البيانات'
  }
];

// Mobile navigation items
export const mobileNavigation = [
  {
    name: 'الرئيسية',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'الطلبات',
    href: '/dashboard/orders',
    icon: ShoppingBag
  },
  {
    name: 'المنتجات',
    href: '/dashboard/products',
    icon: Package
  },
  {
    name: 'الرسائل',
    href: '/dashboard/inbox',
    icon: Inbox
  }
];
