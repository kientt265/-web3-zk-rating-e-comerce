import { FC } from 'react';
import { FundedEvent } from '../lib/type';

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
}

const ProductsList: FC<ProductsListProps> = ({
  combinedData,
  onSelectProduct,
  selectedProduct,
  onQuantityChange,
  onPurchase,
  isLoading
}) => {
  return (
    <div>
      <h2 className="text-xl mb-4">Products</h2>
      {combinedData.length > 0 ? (
        <ul className="space-y-2">
          {combinedData.map((item, index) => (
            <li
              key={index}
              className="p-4 border cursor-pointer border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200"
              onClick={() =>
                onSelectProduct({
                  productID: item.productID,
                  quantity: '',
                  price: item.pricePerProduct,
                })
              }
            >
              Product ID: {item.productID}, Quantity: {item.quantityPerItem}, Price: {item.pricePerProduct}
              {item.rating && item.ratingCount && (
                <span>, Rating: {item.rating}, Rating Count: {item.ratingCount}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}

      {selectedProduct && (
        <div>
          <input
            type="number"
            placeholder="Enter quantity"
            value={selectedProduct.quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={onPurchase}
            disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading}
            className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${
              !selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-400'
            }`}
          >
            {isLoading ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;