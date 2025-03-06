
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const IntegrationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>تكاملات قادمة</CardTitle>
        <CardDescription>
          ربط متجرك مع خدمات أخرى لتوسيع إمكانياته
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>نحن نعمل على إضافة المزيد من التكاملات مع خدمات أخرى مثل:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Google Analytics</li>
          <li>Facebook Pixel</li>
          <li>Mailchimp</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
