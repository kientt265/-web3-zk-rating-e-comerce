import { FC, useEffect } from 'react';
import { FundedEvent } from '../lib/type';
import productImage from '../assets/data/quan02.jpg';

interface ProductsListProps {
  combinedData: (FundedEvent & {
    rating: string | null;
    ratingCount: string | null;
  })[];
  onSelectProduct: (product: { productID: string; quantity: string; price: string }) => void;
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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Available Products</h2>
      
      {combinedData.length > 0 ? (
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4">
              {combinedData.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-64 cursor-pointer transform transition duration-300 hover:scale-105"
                  onClick={() =>
                    onSelectProduct({
                      productID: item.productID,
                      quantity: '',
                      price: item.pricePerProduct,
                    })
                  }
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src={productImage} 
                      alt={`Product ${item.productID}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="font-semibold text-lg mb-2">Product #{item.productID}</div>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>Available: {item.quantityPerItem} units</p>
                        <p>Price: {item.pricePerProduct} ETH</p>
                        {item.rating && item.ratingCount && (
                          <div className="flex items-center mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{item.rating}/5</span>
                            <span className="ml-2 text-gray-500">({item.ratingCount} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found.</p>
      )}

      {selectedProduct && (
        <div className="mt-6 max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Product: #{selectedProduct.productID}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Quantity:</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={selectedProduct.quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={onPurchase}
              disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                !selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
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
      )}
    </div>
  );
};

export default ProductsList;