
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, getProductById } from "@/integrations/supabase/client";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This component is being accessed through a legacy URL, redirect to new structure
    if (productId && storeData?.id) {
      // Redirect to the new URL structure
      navigate(`/store/${storeData.id}/products/${productId}`, { replace: true });
    } else if (!storeData) {
      setError("لا يمكن عرض المنتج بدون معلومات المتجر");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [productId, storeData, navigate]);

  if (loading) {
    return <LoadingState message="جاري التحميل..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتج"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6">
        <h1 className="text-xl font-bold mb-4">جاري إعادة التوجيه...</h1>
        <p className="mb-4">نقوم بتحديث هيكل الروابط في المتجر. سيتم توجيهك تلقائياً إلى الصفحة الصحيحة.</p>
        <Button onClick={() => navigate("/dashboard")}>
          العودة إلى لوحة التحكم
        </Button>
      </Card>
    </div>
  );
};

export default ProductDetail;
