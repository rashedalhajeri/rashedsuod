
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Product, getProductById, updateProduct, deleteProduct } from "@/utils/product-helpers";
import { fetchCategories } from "@/services/category-service";

interface UseProductDetailFormProps {
  productId: string | undefined;
  storeData: any;
}

export const useProductDetailForm = ({ productId, storeData }: UseProductDetailFormProps) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount_price: null as number | null,
    stock_quantity: 0,
    track_inventory: false,
    images: [] as string[],
    category_id: "" as string | null,
    has_colors: false,
    has_sizes: false,
    require_customer_name: false,
    require_customer_image: false,
    available_colors: [] as string[] | null,
    available_sizes: [] as string[] | null
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const { data, error } = await getProductById(productId);
        
        if (error) throw error;
        if (!data) {
          setError("المنتج غير موجود");
          return;
        }
        
        setProduct(data);
        
        const allImages = [
          ...(data.image_url ? [data.image_url] : []),
          ...(data.additional_images || [])
        ];
        
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          discount_price: data.discount_price || null,
          stock_quantity: data.stock_quantity || 0,
          track_inventory: data.track_inventory !== undefined ? data.track_inventory : !!data.stock_quantity,
          images: allImages,
          category_id: data.category_id || null,
          has_colors: data.has_colors || false,
          has_sizes: data.has_sizes || false,
          require_customer_name: data.require_customer_name || false,
          require_customer_image: data.require_customer_image || false,
          available_colors: data.available_colors || [],
          available_sizes: data.available_sizes || []
        });

        if (storeData?.id) {
          const { data: categoriesData } = await fetchCategories(storeData.id);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, storeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock_quantity" || name === "discount_price" ? 
        parseFloat(value) || 0 : 
        value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: categoryId
    }));
  };

  const handleSave = async () => {
    if (!productId || !product) return;
    
    try {
      setSaving(true);
      
      if (formData.images.length === 0) {
        toast.error("يرجى إضافة صورة واحدة على الأقل");
        setSaving(false);
        return;
      }
      
      const updates = {
        ...formData,
        stock_quantity: formData.track_inventory ? formData.stock_quantity : null,
        image_url: formData.images[0] || null,
        additional_images: formData.images.length > 1 ? formData.images.slice(1) : [],
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await updateProduct(productId, updates);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProduct(data[0]);
        toast.success("تم حفظ التغييرات بنجاح");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    
    try {
      setSaving(true);
      const { success, error } = await deleteProduct(productId);
      
      if (error) throw error;
      if (success) {
        toast.success("تم حذف المنتج بنجاح");
        navigate("/products");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setSaving(false);
    }
  };

  return {
    product,
    loading,
    saving,
    error,
    formData,
    categories,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSave,
    handleDelete
  };
};
