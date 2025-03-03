
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertTriangle, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface ProductImportProps {
  storeId: string;
  onSuccess: () => void;
}

export const ProductImport: React.FC<ProductImportProps> = ({ storeId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResults(null);
    }
  };

  const validateRow = (row: any) => {
    const errors = [];
    
    if (!row.name) errors.push('اسم المنتج مطلوب');
    if (isNaN(parseFloat(row.price)) || parseFloat(row.price) < 0) errors.push('السعر غير صالح');
    if (row.stock_quantity && isNaN(parseInt(row.stock_quantity))) errors.push('الكمية غير صالحة');
    
    return errors;
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setImportResults(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data, errors: parseErrors } = results;
        const importErrors: string[] = [];
        let successCount = 0;
        
        // Process each row
        for (let i = 0; i < data.length; i++) {
          const row = data[i] as any;
          const rowErrors = validateRow(row);
          
          if (rowErrors.length > 0) {
            importErrors.push(`صف ${i+1}: ${rowErrors.join(', ')}`);
            continue;
          }
          
          // Create product
          const productData = {
            name: row.name,
            price: parseFloat(row.price),
            description: row.description || null,
            stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : null,
            image_url: row.image_url || null,
            store_id: storeId,
            category_id: row.category_id || null
          };
          
          try {
            const { error } = await supabase
              .from('products')
              .insert([productData]);
            
            if (error) {
              importErrors.push(`صف ${i+1}: ${error.message}`);
            } else {
              successCount++;
            }
          } catch (error) {
            importErrors.push(`صف ${i+1}: خطأ في إدخال البيانات`);
          }
        }
        
        setImportResults({
          success: successCount,
          errors: importErrors
        });
        
        if (successCount > 0 && importErrors.length === 0) {
          onSuccess();
        }
        
        setImporting(false);
      },
      error: (error) => {
        setImportResults({
          success: 0,
          errors: [error.message]
        });
        setImporting(false);
      }
    });
  };

  const resetImport = () => {
    setFile(null);
    setImportResults(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <h3 className="text-lg font-medium">استيراد المنتجات من ملف</h3>
          <p className="text-sm text-gray-500">
            يمكنك استيراد المنتجات من ملف CSV أو XLSX
          </p>
          
          <div className="mt-4 w-full max-w-xs">
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              disabled={importing}
              className="cursor-pointer"
            />
          </div>
          
          {file && (
            <div className="mt-2 flex items-center space-x-2 space-x-reverse">
              <span className="text-sm">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetImport}
                disabled={importing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button
            className="mt-4"
            onClick={handleImport}
            disabled={!file || importing}
          >
            {importing ? 'جاري الاستيراد...' : 'استيراد'}
          </Button>
        </div>
      </div>
      
      {importResults && (
        <Alert variant={importResults.errors.length === 0 ? "default" : "destructive"}>
          <AlertTitle className="flex items-center gap-2">
            {importResults.errors.length === 0 ? (
              <>
                <Check className="h-4 w-4" />
                تم الاستيراد بنجاح
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                حدثت بعض الأخطاء أثناء الاستيراد
              </>
            )}
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p>تم استيراد {importResults.success} منتج بنجاح</p>
              
              {importResults.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">الأخطاء:</p>
                  <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                    {importResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">تنسيق الملف المطلوب:</h4>
        <p className="text-sm text-gray-500">
          يجب أن يحتوي الملف على الأعمدة التالية: name, price, description (اختياري), stock_quantity (اختياري), image_url (اختياري), category_id (اختياري)
        </p>
      </div>
    </div>
  );
};
