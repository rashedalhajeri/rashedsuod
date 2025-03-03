
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Landmark,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";
import SaveButton from "@/components/ui/save-button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// مكون لبطاقة طريقة الدفع
const PaymentMethodCard = ({
  title,
  description,
  icon: Icon,
  isActive,
  isPopular,
  onToggle,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  isActive: boolean;
  isPopular?: boolean;
  onToggle: (checked: boolean) => void;
  onClick: () => void;
}) => {
  return (
    <Card className={`transition-all ${isActive ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {isPopular && (
            <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              الأكثر استخدامًا
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={onToggle}
            />
            <Label className="text-sm">{isActive ? "مفعل" : "معطل"}</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="text-xs"
          >
            إعدادات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Payments = () => {
  const { data: storeData } = useStoreData();
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("payment-methods");
  const [paymentMethods, setPaymentMethods] = React.useState({
    creditCard: true,
    bankTransfer: true,
    mada: true,
    applePay: false,
    cashOnDelivery: true,
  });

  const handleToggleMethod = (method: string, value: boolean) => {
    setPaymentMethods((prev) => ({ ...prev, [method]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // محاكاة حفظ البيانات
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ إعدادات الدفع بنجاح");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">نظام الدفع</h1>
        <p className="text-muted-foreground mt-1">إدارة طرق الدفع وإعداداتها</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="payment-methods">طرق الدفع</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PaymentMethodCard
              title="بطاقة الائتمان"
              description="Visa / Mastercard"
              icon={CreditCard}
              isActive={paymentMethods.creditCard}
              isPopular
              onToggle={(checked) => handleToggleMethod("creditCard", checked)}
              onClick={() => setActiveTab("settings")}
            />
            <PaymentMethodCard
              title="التحويل البنكي"
              description="تحويل مباشر إلى حسابك البنكي"
              icon={Landmark}
              isActive={paymentMethods.bankTransfer}
              onToggle={(checked) => handleToggleMethod("bankTransfer", checked)}
              onClick={() => setActiveTab("settings")}
            />
            <PaymentMethodCard
              title="مدى"
              description="بطاقات مدى البنكية"
              icon={CreditCard}
              isActive={paymentMethods.mada}
              onToggle={(checked) => handleToggleMethod("mada", checked)}
              onClick={() => setActiveTab("settings")}
            />
            <PaymentMethodCard
              title="Apple Pay"
              description="الدفع باستخدام Apple Pay"
              icon={Smartphone}
              isActive={paymentMethods.applePay}
              onToggle={(checked) => handleToggleMethod("applePay", checked)}
              onClick={() => setActiveTab("settings")}
            />
            <PaymentMethodCard
              title="الدفع عند الاستلام"
              description="الدفع نقدًا عند استلام الطلب"
              icon={Landmark}
              isActive={paymentMethods.cashOnDelivery}
              onToggle={(checked) => handleToggleMethod("cashOnDelivery", checked)}
              onClick={() => setActiveTab("settings")}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>دمج بوابات الدفع</CardTitle>
              <CardDescription>
                قم بربط متجرك مع بوابات الدفع لتمكين المدفوعات الإلكترونية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">بوابة الدفع الافتراضية</h3>
                        <p className="text-sm text-muted-foreground">تكامل مع أشهر بوابات الدفع في المنطقة</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600">متصل</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>الإعدادات</span>
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-sm text-muted-foreground">منصة المدفوعات العالمية</p>
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600">يتطلب إعداد</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      <span>إعداد</span>
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">PayPal</h3>
                        <p className="text-sm text-muted-foreground">حلول الدفع الإلكتروني العالمية</p>
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600">يتطلب إعداد</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      <span>إعداد</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-2">
              <SaveButton isSaving={isSaving} onClick={handleSaveSettings} className="w-full sm:w-auto" />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الدفع</CardTitle>
              <CardDescription>
                تخصيص إعدادات المدفوعات والعملات لمتجرك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة الافتراضية</Label>
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={storeData?.currency || "SAR"}
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="QAR">ريال قطري (QAR)</option>
                    <option value="BHD">دينار بحريني (BHD)</option>
                    <option value="OMR">ريال عماني (OMR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">ضريبة القيمة المضافة (%)</Label>
                  <Input id="tax" type="number" placeholder="15" defaultValue="15" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">خيارات متقدمة</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="invoice" />
                    <Label htmlFor="invoice" className="mr-2">تفعيل الفواتير الإلكترونية</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="partial-payments" />
                    <Label htmlFor="partial-payments" className="mr-2">السماح بالدفع الجزئي</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="multi-currency" />
                    <Label htmlFor="multi-currency" className="mr-2">دعم تعدد العملات</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="payment-reminder" />
                    <Label htmlFor="payment-reminder" className="mr-2">تذكير بالدفع تلقائي</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-2">
              <SaveButton isSaving={isSaving} onClick={handleSaveSettings} className="w-full sm:w-auto" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الحساب البنكي</CardTitle>
              <CardDescription>
                أدخل تفاصيل حسابك البنكي لاستلام المدفوعات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">اسم البنك</Label>
                  <Input id="bank-name" placeholder="مثال: البنك الأهلي" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">اسم صاحب الحساب</Label>
                  <Input id="account-name" placeholder="أدخل اسم صاحب الحساب" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">رقم الحساب</Label>
                  <Input id="account-number" placeholder="أدخل رقم الحساب" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">رقم الآيبان (IBAN)</Label>
                  <Input id="iban" placeholder="SA0000000000000000000000" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-2">
              <SaveButton isSaving={isSaving} onClick={handleSaveSettings} className="w-full sm:w-auto" />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات</CardTitle>
              <CardDescription>
                عرض جميع المعاملات المالية لمتجرك
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-muted rounded-full p-3">
                <CreditCard className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">لا توجد معاملات بعد</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm text-center">
                لم يتم تسجيل أي معاملات مالية في متجرك حتى الآن. ستظهر هنا فور إتمام أول عملية دفع.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
