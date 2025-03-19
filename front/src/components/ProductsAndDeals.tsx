import { FC } from 'react';
import ProductsList from './ProductsList';
import DealStateList from './DealStateList';

interface ProductsAndDealsProps {
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
  activeView: 'products' | 'deals';
  onGetDelivering: (completed: boolean) => void;
}

const ProductsAndDeals: FC<ProductsAndDealsProps> = (props) => {
  return (
    <div>
      <div className="flex items-center gap-3 justify-center mb-6">
        <button
          onClick={() => props.onGetDelivering(true)}
          className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Lịch Sử Mua Hàng
        </button>
        <button
          onClick={() => props.onGetDelivering(false)}
          className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Hàng Đang Vận Chuyển
        </button>
        {/* <button 
          onClick={props.onGetProducts} 
          className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Mua Hàng
        </button> */}
      </div>

      {props.activeView === 'products' ? (
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