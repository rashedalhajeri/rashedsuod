
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productId, storeDomain } = useParams();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">تفاصيل المنتج</h1>
      <p className="text-gray-600">معرف المنتج: {productId}</p>
      <p className="text-gray-600">نطاق المتجر: {storeDomain}</p>
    </div>
  );
};

export default ProductDetails;
