
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentMethodItem from "@/features/dashboard/components/PaymentMethodItem";
import { CreditCard, Wallet, DollarSign, PiggyBank } from "lucide-react";

interface PaymentTabProps {
  isPaidPlan: boolean;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ isPaidPlan }) => {
  const [methods, setMethods] = React.useState({
    creditCard: true,
    cashOnDelivery: true,
    bankTransfer: false,
    knet: false,
  });

  const handleMethodChange = (method: keyof typeof methods) => (checked: boolean) => {
    setMethods(prev => ({ ...prev, [method]: checked }));
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/10 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>طرق الدفع</span>
          </CardTitle>
          <CardDescription>
            قم بتفعيل طرق الدفع التي تريد أن تتيحها للعملاء في متجرك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <PaymentMethodItem
            id="credit-card"
            title="بطاقة إئتمانية"
            description="قبول الدفع بالبطاقات الإئتمانية (فيزا، ماستر كارد)"
            checked={methods.creditCard}
            onCheckedChange={handleMethodChange('creditCard')}
            isPaidPlan={true}
            icon={<CreditCard size={20} />}
            color="bg-blue-500"
            badges={[{ text: "الأكثر استخداماً", color: "bg-blue-50 text-blue-600 border-blue-100" }]}
          />

          <PaymentMethodItem
            id="cash-on-delivery"
            title="الدفع عند الاستلام"
            description="يدفع العميل عند استلام الطلب نقداً"
            checked={methods.cashOnDelivery}
            onCheckedChange={handleMethodChange('cashOnDelivery')}
            isPaidPlan={true}
            icon={<Wallet size={20} />}
            color="bg-green-500"
          />

          <PaymentMethodItem
            id="bank-transfer"
            title="تحويل بنكي"
            description="يقوم العميل بالتحويل البنكي إلى حسابك المصرفي"
            checked={methods.bankTransfer}
            onCheckedChange={handleMethodChange('bankTransfer')}
            isPaidPlan={isPaidPlan}
            disabled={!isPaidPlan}
            icon={<DollarSign size={20} />}
            color="bg-purple-500"
            tooltipContent="تمكين العملاء من الدفع عن طريق التحويل البنكي"
          />

          <PaymentMethodItem
            id="knet"
            title="كي نت"
            description="قبول الدفع عبر بوابة كي نت للبطاقات المصرفية"
            checked={methods.knet}
            onCheckedChange={handleMethodChange('knet')}
            isPaidPlan={isPaidPlan}
            disabled={!isPaidPlan}
            icon={<PiggyBank size={20} />}
            color="bg-orange-500"
            tooltipContent="تمكين العملاء من الدفع باستخدام كي نت"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab;
