
import React, { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogClose 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, CheckCircle, AlertCircle, Image, ImagePlus } from "lucide-react";
import useStoreData from "@/hooks/use-store-data";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  additional_images: string[];
}

interface FormErrors {
  name?: string;
  price?: string;
  image?: string;
}

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    image_url: null,
    additional_images: []
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: storeData } = useStoreData();

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: null,
      additional_images: []
    });
    setFormErrors({});
    setUploadState('idle');
    setUploadProgress(0);
    setUploadingImages([]);
  }, []);

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = "يرجى إدخال اسم المنتج";
    }
    
    if (formData.price <= 0) {
      errors.price = "يجب أن يكون السعر أكبر من صفر";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const simulateUploadProgress = (imageId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95;
        clearInterval(interval);
      }
      
      setUploadingImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, progress } : img
      ));
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("يرجى رفع صورة فقط");
      setFormErrors(prev => ({ ...prev, image: "يرجى رفع صورة فقط" }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
      setFormErrors(prev => ({ ...prev, image: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت" }));
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadState('uploading');
      setFormErrors(prev => ({ ...prev, image: undefined }));
      
      const stopSimulation = simulateUploadProgress("main-image");
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${storeData.id}/${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('store-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      stopSimulation();
      
      if (error) {
        throw error;
      }
      
      setUploadProgress(100);
      
      const { data: urlData } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        image_url: urlData.publicUrl
      }));
      
      setUploadState('success');
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadState('error');
      setFormErrors(prev => ({ ...prev, image: "حدث خطأ أثناء رفع الصورة" }));
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (!storeData?.id) {
      toast.error("لم يتم العثور على معرف المتجر");
      return;
    }
    
    const newUploadingImages: UploadingImage[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadingImages(prev => [...prev, ...newUploadingImages]);
    
    for (const uploadImage of newUploadingImages) {
      const file = uploadImage.file;
      
      if (!file.type.startsWith('image/')) {
        setUploadingImages(prev => prev.map(img => 
          img.id === uploadImage.id 
            ? { ...img, status: 'error', error: "يجب رفع صورة فقط" } 
            : img
        ));
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setUploadingImages(prev => prev.map(img => 
          img.id === uploadImage.id 
            ? { ...img, status: 'error', error: "حجم الصورة أكبر من 5 ميجابايت" } 
            : img
        ));
        continue;
      }
      
      try {
        const stopSimulation = simulateUploadProgress(uploadImage.id);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${storeData.id}/${Date.now()}-${uploadImage.id}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('store-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        stopSimulation();
        
        if (error) {
          throw error;
        }
        
        const { data: urlData } = supabase.storage
          .from('store-images')
          .getPublicUrl(filePath);
        
        setUploadingImages(prev => prev.map(img => 
          img.id === uploadImage.id 
            ? { ...img, status: 'success', progress: 100, url: urlData.publicUrl } 
            : img
        ));
        
        setFormData(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, urlData.publicUrl]
        }));
      } catch (error) {
        console.error("Error uploading additional image:", error);
        setUploadingImages(prev => prev.map(img => 
          img.id === uploadImage.id 
            ? { ...img, status: 'error', error: "فشل رفع الصورة" } 
            : img
        ));
      }
    }
    
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveUploadingImage = (id: string) => {
    setUploadingImages(prev => prev.filter(img => img.id !== id));
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: null }));
    setUploadState('idle');
    setUploadProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddProduct = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      const { data: storeData } = await useStoreData().refetch();
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const additionalImagesUrls = Array.isArray(formData.additional_images) ? formData.additional_images : [];
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            store_id: storeData.id,
            name: formData.name.trim(),
            description: formData.description?.trim() || null,
            price: formData.price,
            stock_quantity: formData.stock_quantity || 0,
            image_url: formData.image_url,
            additional_images: additionalImagesUrls
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding product:", error);
        toast.error("حدث خطأ أثناء إضافة المنتج");
        return;
      }
      
      toast.success("تمت إضافة المنتج بنجاح");
      onClose();
      resetForm();
      onSuccess();
      
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const renderImageUploader = () => {
    return (
      <div className="grid gap-2">
        <Label htmlFor="image_url">صورة المنتج الرئيسية</Label>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          
          {formData.image_url ? (
            <div className="relative w-full h-48 bg-gray-50 rounded-md overflow-hidden border border-green-200 transition-all hover:shadow-md group">
              <img 
                src={formData.image_url} 
                alt="Product" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-green-50 text-green-700 p-2 text-sm flex items-center gap-2 border-t border-green-200">
                <CheckCircle className="h-4 w-4" />
                تم رفع الصورة بنجاح
              </div>
            </div>
          ) : (
            <div 
              className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition ${
                uploadState === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadState === 'uploading' ? (
                <div className="flex flex-col items-center w-full px-8">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    <p className="text-sm font-medium">جاري رفع الصورة...</p>
                  </div>
                  <Progress value={uploadProgress} className="w-full h-2" />
                  <p className="text-xs text-gray-500 mt-2">{Math.round(uploadProgress)}%</p>
                </div>
              ) : uploadState === 'error' ? (
                <>
                  <div className="rounded-full bg-red-100 p-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-sm font-medium text-red-600">فشل رفع الصورة</p>
                  <p className="text-xs text-red-500">{formErrors.image}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadState('idle');
                      setFormErrors(prev => ({ ...prev, image: undefined }));
                    }}
                  >
                    حاول مرة أخرى
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">اضغط هنا لرفع صورة رئيسية</p>
                  <p className="text-xs text-gray-500">يدعم صيغ JPG، PNG بحد أقصى 5MB</p>
                </>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Image className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="image_url" 
                name="image_url" 
                placeholder="أو أدخل رابط صورة المنتج مباشرة" 
                value={formData.image_url || ''} 
                onChange={handleInputChange}
                className="pl-3 pr-10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 ml-2" />
              رفع صورة
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAdditionalImagesUploader = () => {
    return (
      <div className="grid gap-2 mt-4">
        <Label className="flex items-center justify-between">
          <span>صور إضافية للمنتج</span>
          <span className="text-xs text-muted-foreground">
            {Array.isArray(formData.additional_images) ? formData.additional_images.length : 0}/5 صور
          </span>
        </Label>
        
        <input
          type="file"
          accept="image/*"
          multiple
          ref={multipleFileInputRef}
          onChange={handleMultipleImagesUpload}
          className="hidden"
        />
        
        {Array.isArray(formData.additional_images) && formData.additional_images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {formData.additional_images.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 group hover:shadow-md transition-all">
                <img 
                  src={imageUrl} 
                  alt={`Additional ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleRemoveAdditionalImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {uploadingImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {uploadingImages.map((uploadImage) => (
              <div 
                key={uploadImage.id} 
                className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden border ${
                  uploadImage.status === 'uploading' ? 'border-blue-200 bg-blue-50' :
                  uploadImage.status === 'success' ? 'border-green-200 bg-green-50' :
                  'border-red-200 bg-red-50'
                }`}
              >
                {uploadImage.status === 'success' && uploadImage.url ? (
                  <img 
                    src={uploadImage.url} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    {uploadImage.status === 'uploading' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mb-2"></div>
                        <Progress value={uploadImage.progress} className="w-full h-1.5 mb-1" />
                        <p className="text-xs text-blue-600">{Math.round(uploadImage.progress)}%</p>
                      </>
                    ) : uploadImage.status === 'error' ? (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
                        <p className="text-xs text-red-600 text-center">{uploadImage.error}</p>
                      </>
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                )}
                
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-6 w-6 absolute top-1 right-1"
                  onClick={() => handleRemoveUploadingImage(uploadImage.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-20 border-dashed flex flex-col gap-1 hover:bg-gray-50 transition-colors"
          onClick={() => multipleFileInputRef.current?.click()}
          disabled={Array.isArray(formData.additional_images) && formData.additional_images.length >= 5}
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-sm">إضافة صور للمنتج</span>
          <span className="text-xs text-muted-foreground">يمكنك إضافة حتى 5 صور</span>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-lg">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary/10 p-1.5 rounded-md">
              <ImagePlus className="h-5 w-5 text-primary" />
            </span>
            إضافة منتج جديد
          </DialogTitle>
          <DialogDescription>
            أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 pt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">معلومات المنتج</TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-white">الصور</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-white">المخزون والسعر</TabsTrigger>
          </TabsList>
          
          <div className="max-h-[60vh] overflow-y-auto py-2 pr-2 pl-0 -mr-2 scrollbar">
            <TabsContent value="details" className="m-0 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="أدخل اسم المنتج" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    className={formErrors.name ? "border-red-300" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="أدخل وصف المنتج"
                    value={formData.description || ''} 
                    onChange={handleInputChange} 
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="m-0 space-y-4">
              {renderImageUploader()}
              {renderAdditionalImagesUploader()}
            </TabsContent>
            
            <TabsContent value="inventory" className="m-0 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.price === 0 ? "" : formData.price} 
                      onChange={handleInputChange}
                      className={`pl-16 text-base font-semibold dir-ltr ${formErrors.price ? "border-red-300" : ""}`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 border-r border-gray-200 pr-2">
                      <span className="text-sm">{storeData?.currency || 'KWD'}</span>
                    </div>
                  </div>
                  {formErrors.price && (
                    <p className="text-sm text-red-500">{formErrors.price}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
                  <Input 
                    id="stock_quantity" 
                    name="stock_quantity" 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock_quantity === 0 ? "" : formData.stock_quantity} 
                    onChange={handleInputChange} 
                  />
                  <p className="text-xs text-gray-500">اترك الكمية كـ 0 إذا كان المنتج غير متوفر في المخزون</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="p-6 bg-gray-50 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleAddProduct} 
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90"
          >
            إضافة المنتج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
