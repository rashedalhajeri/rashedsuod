
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionText?: string;
  actionUrl?: string;
}

const DeploymentChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "domain",
      title: "إعداد النطاق",
      description: "تكوين النطاق الخاص بك أو استخدام نطاق linok.me الفرعي",
      completed: true,
    },
    {
      id: "payment",
      title: "ربط بوابات الدفع",
      description: "تكوين بوابات الدفع مثل KNET وVisaMasterCard",
      completed: false,
      actionText: "إعداد الدفع",
      actionUrl: "/dashboard/settings?tab=billing"
    },
    {
      id: "content",
      title: "إكمال محتوى المتجر",
      description: "إضافة المنتجات والفئات وإعدادات المتجر",
      completed: false,
      actionText: "إضافة محتوى",
      actionUrl: "/dashboard/products"
    },
    {
      id: "shipping",
      title: "تكوين الشحن",
      description: "إعداد طرق الشحن ومناطق التوصيل",
      completed: false,
      actionText: "إعداد الشحن",
      actionUrl: "/dashboard/settings?tab=shipping"
    },
    {
      id: "testing",
      title: "اختبار المتجر",
      description: "إجراء عمليات شراء تجريبية والتحقق من سير العمل بشكل صحيح",
      completed: false,
      actionText: "إجراء اختبار",
    }
  ]);
  
  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklist.length) * 100;
  
  const toggleComplete = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    const item = checklist.find(i => i.id === id);
    if (item) {
      toast.success(`تم ${!item.completed ? 'إكمال' : 'إعادة فتح'} "${item.title}"`);
    }
  };
  
  return (
    <Card className="shadow-sm border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          قائمة التحقق قبل النشر
          <span className="text-sm font-normal text-muted-foreground">
            ({completedCount} من {checklist.length} مكتملة)
          </span>
        </CardTitle>
        <CardDescription>أكمل هذه الخطوات لتجهيز متجرك للنشر</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {checklist.map((item) => (
            <div 
              key={item.id}
              className={`p-3 border rounded-lg flex items-start gap-3 ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <Button
                variant="ghost" 
                size="sm"
                className={`rounded-full p-0 h-6 w-6 ${
                  item.completed ? 'text-green-600' : 'text-gray-400'
                }`}
                onClick={() => toggleComplete(item.id)}
              >
                {item.completed ? 
                  <CheckCircle2 className="h-6 w-6" /> : 
                  <Circle className="h-6 w-6" />
                }
              </Button>
              
              <div className="flex-grow">
                <h4 className={`text-sm font-medium ${item.completed ? 'text-green-800' : 'text-gray-900'}`}>{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
              
              {item.actionText && !item.completed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  asChild
                >
                  {item.actionUrl ? (
                    <a href={item.actionUrl}>
                      {item.actionText}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <span>{item.actionText}</span>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {progressPercentage === 100 && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
            <p className="text-green-800 font-medium">تهانينا! متجرك جاهز للنشر</p>
            <Button className="mt-2" size="sm">
              نشر المتجر الآن
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentChecklist;
