
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CurrencyLanguageFormProps {
  currencyLanguageValues: {
    currency: string;
    language: string;
  };
}

const CurrencyLanguageForm: React.FC<CurrencyLanguageFormProps> = ({
  currencyLanguageValues
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>العملة واللغة</CardTitle>
        <CardDescription>تعديل العملة واللغة الافتراضية للمتجر</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="store-currency">العملة</Label>
            <Input 
              id="store-currency" 
              value={currencyLanguageValues.currency} 
              className="mt-1" 
              disabled 
            />
          </div>
          <div>
            <Label htmlFor="store-language">اللغة</Label>
            <Input 
              id="store-language" 
              value={currencyLanguageValues.language} 
              className="mt-1" 
              disabled 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyLanguageForm;
