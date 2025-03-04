
export type SubscriptionPlan = "basic" | "premium";

export interface PlanFeature {
  title: string;
  available: boolean;
  highlight?: boolean;
}

export interface PlanDetails {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
}

export const subscriptionPlans: Record<SubscriptionPlan, PlanDetails> = {
  basic: {
    name: "الأساسية",
    description: "للأعمال الصغيرة والناشئة",
    price: 90,
    duration: "لمدة 6 أشهر",
    features: [
      { title: "إضافة حتى 50 منتج", available: true },
      { title: "متجر إلكتروني كامل", available: true, highlight: true },
      { title: "دعم فني عبر البريد الإلكتروني", available: true },
      { title: "إحصائيات أساسية", available: true },
      { title: "نطاق فرعي (your-store.linok.me)", available: true },
      { title: "نطاق مخصص", available: false },
      { title: "تكامل مع وسائل التواصل الاجتماعي", available: false },
      { title: "دعم فني متقدم", available: false }
    ],
    buttonText: "اختيار الباقة"
  },
  premium: {
    name: "الاحترافية",
    description: "للأعمال المتوسطة والمتنامية",
    price: 150,
    duration: "لمدة 6 أشهر",
    features: [
      { title: "منتجات غير محدودة", available: true, highlight: true },
      { title: "متجر إلكتروني كامل", available: true },
      { title: "دعم فني عبر الهاتف والبريد", available: true, highlight: true },
      { title: "إحصائيات متقدمة", available: true },
      { title: "نطاق فرعي (your-store.linok.me)", available: true },
      { title: "نطاق مخصص", available: true },
      { title: "تكامل مع وسائل التواصل الاجتماعي", available: true },
      { title: "تقارير مبيعات متقدمة", available: true, highlight: true }
    ],
    popular: true,
    buttonText: "اختيار الباقة"
  }
};
