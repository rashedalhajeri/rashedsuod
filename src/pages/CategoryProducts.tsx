
import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryProducts = () => {
  const { categoryName, storeDomain } = useParams();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">منتجات الفئة: {categoryName}</h1>
      <p className="text-gray-600">نطاق المتجر: {storeDomain}</p>
    </div>
  );
};

export default CategoryProducts;
