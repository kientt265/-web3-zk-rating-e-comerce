import { FC, useState } from 'react';
import ProductsList from './ProductsList';
import DealStateList from './DealStateList';

interface ProductsAndDealsProps {
  // Thêm tất cả props từ cả hai component
  combinedData: any[];
  onSelectProduct: (product: { productID: string; quantity: string; price: string } | null) => void;
  selectedProduct: { productID: string; quantity: string; price: string } | null;
  onQuantityChange: (quantity: string) => void;
  onPurchase: () => void;
  isLoading?: boolean;
  onGetProducts: () => void;
  deals: any[];
  onConfirmDeal: (dealId: string) => void;
  onShowRating: (dealId: string, productId: string) => void;
}

const ProductsAndDeals: FC<ProductsAndDealsProps> = (props) => {
  const [activeView, setActiveView] = useState<'products' | 'deals'>('products');

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveView('products')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeView === 'products'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sản phẩm
        </button>
        <button
          onClick={() => setActiveView('deals')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeView === 'deals'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Đơn hàng của tôi
        </button>
      </div>

      {activeView === 'products' ? (
        <ProductsList
          combinedData={props.combinedData}
          onSelectProduct={props.onSelectProduct}
          selectedProduct={props.selectedProduct}
          onQuantityChange={props.onQuantityChange}
          onPurchase={props.onPurchase}
          isLoading={props.isLoading}
          onGetProducts={props.onGetProducts}
        />
      ) : (
        <DealStateList
          deals={props.deals}
          onConfirmDeal={props.onConfirmDeal}
          onShowRating={props.onShowRating}
        />
      )}
    </div>
  );
};

export default ProductsAndDeals;