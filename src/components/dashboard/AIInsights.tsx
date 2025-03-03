
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Users, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type?: 'success' | 'warning' | 'info';
}

const AIInsight: React.FC<AIInsightProps> = ({ 
  title, 
  description, 
  icon,
  type = 'info' 
}) => {
  const getBgColor = () => {
    switch(type) {
      case 'success': return 'from-green-50 to-white border-green-100';
      case 'warning': return 'from-orange-50 to-white border-orange-100';
      case 'info': 
      default: return 'from-primary-50 to-white border-primary-100';
    }
  };
  
  const getIconColor = () => {
    switch(type) {
      case 'success': return 'text-green-300';
      case 'warning': return 'text-orange-300';
      case 'info': 
      default: return 'text-primary-300';
    }
  };
  
  const getTitleColor = () => {
    switch(type) {
      case 'success': return 'text-green-700';
      case 'warning': return 'text-orange-700';
      case 'info': 
      default: return 'text-primary-700';
    }
  };
  
  return (
    <div className={`ai-insight-card bg-gradient-to-r ${getBgColor()}`}>
      <div className={`ai-insight-icon ${getIconColor()}`}>
        {icon}
      </div>
      <h4 className={`ai-insight-title ${getTitleColor()}`}>{title}</h4>
      <p className="ai-insight-content">{description}</p>
    </div>
  );
};

const AIInsights: React.FC = () => {
  // في التطبيق الحقيقي، هذه البيانات ستأتي من تحليل ذكاء اصطناعي فعلي
  const insights = [
    {
      title: 'اقتراح لزيادة المبيعات',
      description: 'إضافة عروض مخصصة للعملاء المتكررين قد يزيد المبيعات بنسبة 15%',
      icon: <TrendingUp size={32} />,
      type: 'success' as const
    },
    {
      title: 'نشاط العملاء',
      description: '6 عملاء جدد زاروا متجرك في الأسبوع الماضي ولم يكملوا الشراء',
      icon: <Users size={32} />,
      type: 'info' as const
    },
    {
      title: 'تحسين المخزون',
      description: 'المنتج "ساعة ذكية" سينفد قريبًا، اطلب المزيد لتجنب نفاد المخزون',
      icon: <ShoppingBag size={32} />,
      type: 'warning' as const
    }
  ];

  return (
    <Card className="border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardTitle className="flex items-center">
          <Brain className="inline-block ml-2 h-5 w-5 text-primary-500" />
          توصيات الذكاء الاصطناعي
        </CardTitle>
        <CardDescription>نظرة تحليلية ذكية لتحسين أداء متجرك</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <AIInsight
              key={index}
              title={insight.title}
              description={insight.description}
              icon={insight.icon}
              type={insight.type}
            />
          ))}
          
          <Button 
            variant="ghost"
            className="text-primary-600 font-medium hover:underline bg-transparent flex items-center w-full justify-center mt-2"
          >
            عرض جميع التوصيات
            <ArrowRight className="mr-1 h-4 w-4 inline-block" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
