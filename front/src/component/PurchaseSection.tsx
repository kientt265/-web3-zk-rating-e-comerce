// src/components/PurchaseSection.tsx
interface SelectedProduct {
    productID: string;
    quantity: string;
    price: string;
  }
  
  interface PurchaseSectionProps {
    selectedProduct: SelectedProduct | null;
    setSelectedProduct: (product: SelectedProduct | null) => void;
    handleCreateDeal: () => Promise<void>;
  }
  
  function PurchaseSection({ selectedProduct, setSelectedProduct, handleCreateDeal }: PurchaseSectionProps) {
    if (!selectedProduct) return null;
  
    return (
      <div>
        <input
          type="number"
          placeholder="Enter quantity"
          value={selectedProduct.quantity}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleCreateDeal}
          disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0}
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
        >
          Purchase
        </button>
      </div>
    );
  }
  
  export default PurchaseSection;