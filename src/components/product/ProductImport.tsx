
import React, { useState } from "react";
import { UploadCloud, AlertCircle, Check, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Papa from "papaparse";

interface ProductImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => Promise<void>;
  storeId: string;
}

export const ProductImport: React.FC<ProductImportProps> = ({
  isOpen,
  onClose,
  onImport,
  storeId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };
  
  const handleFileSelected = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension !== 'csv') {
      setError('الرجاء اختيار ملف CSV فقط');
      return;
    }
    
    setFile(file);
    setError(null);
    
    // Parse CSV file
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const requiredFields = ['name', 'price'];
        const headers = results.meta.fields || [];
        
        const missingFields = requiredFields.filter(field => !headers.includes(field));
        
        if (missingFields.length > 0) {
          setError(`الملف غير صالح. الحقول التالية مفقودة: ${missingFields.join(', ')}`);
          return;
        }
        
        // Validate and transform data
        const validProducts = results.data
          .filter((row: any) => row.name && !isNaN(parseFloat(row.price)))
          .map((row: any) => ({
            name: row.name,
            price: parseFloat(row.price),
            description: row.description || null,
            stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : null,
            image_url: row.image_url || null,
            store_id: storeId,
            category_id: row.category_id || null
          }));
        
        if (validProducts.length === 0) {
          setError('لا توجد منتجات صالحة في الملف المختار');
          return;
        }
        
        setParsedData(validProducts);
      },
      error: (error) => {
        setError(`خطأ في تحليل الملف: ${error.message}`);
      }
    });
  };
  
  const handleImport = async () => {
    if (!parsedData) return;
    
    try {
      setIsUploading(true);
      await onImport(parsedData);
      toast.success(`تم استيراد ${parsedData.length} منتج بنجاح`);
      onClose();
    } catch (error) {
      toast.error('حدث خطأ أثناء استيراد المنتجات');
      console.error('Import error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>استيراد المنتجات</DialogTitle>
          <DialogDescription>
            يمكنك استيراد منتجات متعددة عن طريق ملف CSV. تأكد من أن الملف يحتوي على الأعمدة المطلوبة.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 p-2">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 transition-colors text-center",
              isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300",
              error ? "border-red-300" : ""
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <div className="bg-primary-50 p-2 rounded-md flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary-600 mx-auto" />
                </div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} كيلوبايت</div>
                {parsedData && (
                  <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                    <Check className="h-4 w-4" />
                    تم تحليل {parsedData.length} منتج
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500" 
                  onClick={() => {
                    setFile(null);
                    setParsedData(null);
                  }}
                >
                  <X className="h-4 w-4 ml-2" />
                  إزالة الملف
                </Button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-sm text-gray-600">
                  اسحب وأفلت ملف CSV هنا أو
                  <label className="mx-1 text-primary-600 hover:text-primary-700 cursor-pointer">
                    تصفح
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  حجم الملف الأقصى: 10 ميجابايت
                </p>
              </>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start gap-2 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">تنسيق الملف المطلوب:</h4>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>يجب أن يكون الملف بتنسيق CSV</li>
              <li>الأعمدة المطلوبة: name, price</li>
              <li>الأعمدة الاختيارية: description, stock_quantity, image_url, category_id</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!parsedData || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الاستيراد...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 ml-2" />
                استيراد المنتجات
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
