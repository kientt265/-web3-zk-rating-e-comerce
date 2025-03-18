import { DealEvent } from '../lib/type';

interface DealListProps {
  dealState: DealEvent[];
  onConfirmDeal: (dealId: string) => void;
  onShowRating: (dealId: string, productId: string) => void;
}

export function DealList({ dealState, onConfirmDeal, onShowRating }: DealListProps) {
  if (dealState.length === 0) {
    return <p>Bạn chưa mua gì</p>;
  }

  return (
    <ul className="space-y-2">
      {dealState.map((deal, index) => (
        <li key={index} className="p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200 cursor-pointer">
          Deal ID: {deal.dealId}, Buyer: {deal.buyer}, Product ID: {deal.productID}, 
          Amount: {deal.amount}, Value: {deal.value}, Completed: {deal.isCompleted ? "Yes" : "No"}
          {!deal.isCompleted && (
            <button 
              onClick={() => onConfirmDeal(deal.dealId)}
              className="ml-4 bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-400 transition-colors"
            >
              Đã Nhận được Hàng
            </button>
          )}
          {deal.isCompleted && (
            <button 
              onClick={() => onShowRating(deal.dealId, deal.productID)}
              className="ml-4 bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-400 transition-colors"
            >
              Đánh giá sản phẩm
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}