
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface ProductGridProps {
  products: any[];
  storeDomain?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, storeDomain = "" }) => {
  
  // Helper function to format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 3, 
      maximumFractionDigits: 3
    }).format(price);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">لا توجد منتجات</h3>
        <p className="text-gray-500">لم نتمكن من العثور على أي منتجات في هذا القسم</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/store/${storeDomain}/product/${product.id}`}
          className="store-card group relative"
        >
          <div className="store-card-image">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            {/* Discount badge */}
            {product.discount_percentage && (
              <div className="product-badge badge-discount">
                -{product.discount_percentage}%
              </div>
            )}
            
            {/* New product badge */}
            {product.is_new && (
              <div className="product-badge badge-new">
                جديد
              </div>
            )}
            
            {/* Out of stock badge */}
            {product.stock_quantity === 0 && (
              <div className="product-badge badge-out-of-stock">
                نفذت الكمية
              </div>
            )}
            
            {/* Favorite button */}
            <button 
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                // Add to favorites logic here
              }}
            >
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
            </button>
          </div>
          
          <div className="store-card-content">
            <h3 className="store-card-title">{product.name}</h3>
            
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="store-card-price">{formatCurrency(product.price)}</p>
                {product.original_price && product.original_price > product.price && (
                  <p className="store-card-original-price">{formatCurrency(product.original_price)}</p>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
