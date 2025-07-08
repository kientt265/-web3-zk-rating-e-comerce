import { FC, useEffect, useState } from 'react';
import { FundedEvent } from '../lib/type';
import productImage from '../assets/data/quan02.jpg';
import productImagetest from '../assets/data/ao02.jpg';
import productImage2 from '../assets/data/bowling.png';
import productImage3 from '../assets/data/sale.png';
import productImage4 from '../assets/data/shirt.png';
import { DetailProduct } from './DetailProduct';

// Tạo mảng chứa 5 ảnh
const productImages = [
  productImage,
  productImagetest,
  productImage2,
  productImage3,
  productImage4,
];

interface ProductsListProps {
  combinedData: (FundedEvent & {
    rating: string | null;
    ratingCount: string | null;
  })[];
  onSelectProduct: (product: { productID: string; quantity: string; price: string } | null) => void;  // Updated this line
  selectedProduct: { productID: string; quantity: string; price: string } | null;
  onQuantityChange: (quantity: string) => void;
  onPurchase: () => void;
  isLoading?: boolean;
  onGetProducts: () => void; // Add this new prop
}

const ProductsList: FC<ProductsListProps> = ({
  combinedData,
  onSelectProduct,
  selectedProduct,
  onQuantityChange,
  onPurchase,
  isLoading,
  onGetProducts
}) => {
  useEffect(() => {
    if (combinedData.length === 0) {
      onGetProducts();
    }
  }, [onGetProducts, combinedData]);

  // Map productID với 1 ảnh random, giữ cố định khi render lại
  const [productImagesMap, setProductImagesMap] = useState<{ [productID: string]: string }>({});

  useEffect(() => {
    const newMap: { [productID: string]: string } = { ...productImagesMap };
    combinedData.forEach((item) => {
      if (!newMap[item.productID]) {
        const randomImg = productImages[Math.floor(Math.random() * productImages.length)];
        newMap[item.productID] = randomImg;
      }
    });
    setProductImagesMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedData]);

  const [selectedDetailProduct, setSelectedDetailProduct] = useState<(FundedEvent & {
    rating: string | null;
    ratingCount: string | null;
    imageUrl?: string;
  }) | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Available Products</h2> */}
      
      {combinedData.length > 0 ? (
        <div className="relative">
          <div className="overflow-x-auto pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {combinedData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={productImagesMap[item.productID] || productImage} 
                      alt={`Product ${item.productID}`}
                      className="w-full h-56 object-cover rounded-t-xl"
                    />
                    {item.rating && (
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-md">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Product #{item.productID}</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 flex justify-between">
                        <span>Available:</span>
                        <span className="font-semibold">{item.quantityPerItem} units</span>
                      </p>
                      <p className="text-gray-600 flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-blue-600">{item.pricePerProduct} ETH</span>
                      </p>
                      {item.rating && item.ratingCount && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Rating:</span>
                            <span>{item.ratingCount} reviews</span>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailProduct({
                              ...item,
                              imageUrl: productImagesMap[item.productID] || productImage
                            });
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold transition duration-200"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct({
                              productID: item.productID,
                              quantity: '',
                              price: item.pricePerProduct,
                            });
                          }}
                          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-200"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Selected Product: #{selectedProduct.productID}</h3>
              <button 
                onClick={() => onSelectProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Quantity:</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={selectedProduct.quantity}
                  onChange={(e) => onQuantityChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onSelectProduct(null)}
                  className="flex-1 py-3 px-4 rounded-lg text-gray-700 font-semibold transition duration-200 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onPurchase}
                  disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                    !selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 transform hover:-translate-y-1'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Purchase'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedDetailProduct && (
        <DetailProduct 
          product={selectedDetailProduct} 
          onClose={() => setSelectedDetailProduct(null)} 
        />
      )}
    </div>
  );
};

export default ProductsList;