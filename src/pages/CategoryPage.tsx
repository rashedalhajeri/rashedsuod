
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCategoryData } from "@/hooks/use-category-data";
import CategoryHeader from "@/components/store/category/CategoryHeader";
import CategoryContent from "@/components/store/category/CategoryContent";
import { toast } from "sonner";

const CategoryPage = () => {
  const { storeDomain, categoryName } = useParams<{ storeDomain: string; categoryName: string }>();
  const { storeData, isLoading: isLoadingStore, error } = useStoreData();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { 
    categoryDetails,
    isLoadingProducts,
    productNames,
    categories,
    sections,
    filteredProducts
  } = useCategoryData(categoryName, searchQuery);

  // Show success toast when category is loaded
  useEffect(() => {
    if (categoryDetails && !isLoadingProducts) {
      const msg = categoryName === "الكل" 
        ? "تم عرض جميع المنتجات" 
        : `تم عرض منتجات ${categoryDetails.name}`;
      toast.success(msg);
    }
  }, [categoryDetails, isLoadingProducts, categoryName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      toast.info(`جاري البحث عن: ${searchQuery}`);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    if (!storeDomain) return;
    
    if (category === "الكل") {
      navigate(`/store/${storeDomain}/category/الكل`);
    } else {
      navigate(`/store/${storeDomain}/category/${encodeURIComponent(category.toLowerCase())}`);
    }
  };
  
  const handleSectionChange = (section: string) => {
    console.log("Section changed:", section);
  };

  if (isLoadingStore) {
    return <LoadingState message="جاري تحميل المتجر..." />;
  }

  if (error) {
    return <ErrorState title="خطأ" message={error.message || "حدث خطأ أثناء تحميل المتجر"} />;
  }
  
  const headerTitle = categoryDetails?.name || "جميع المنتجات";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <CategoryHeader 
        headerTitle={headerTitle} 
        storeDomain={storeDomain}
      />
      
      <div>
        <CategoryContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          productNames={productNames}
          categories={categories}
          sections={sections}
          categoryName={categoryName}
          handleCategoryChange={handleCategoryChange}
          handleSectionChange={handleSectionChange}
          isLoadingProducts={isLoadingProducts}
          filteredProducts={filteredProducts}
          storeDomain={storeDomain}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
