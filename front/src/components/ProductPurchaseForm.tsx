interface ProductPurchaseFormProps {
    selectedProduct: { productID: string; quantity: string; price: string } | null;
    onQuantityChange: (quantity: string) => void;
    onPurchase: () => void;
  }
  
  export function ProductPurchaseForm({ selectedProduct, onQuantityChange, onPurchase }: ProductPurchaseFormProps) {
    if (!selectedProduct) return null;
  
    return (
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
          disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0}
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${
            !selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-400'
          }`}
        >
          Purchase
        </button>
      </div>
    );
  }