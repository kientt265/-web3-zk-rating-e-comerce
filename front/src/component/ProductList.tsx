// src/components/ProductList.tsx
interface FundedEventWithRating {
    productID: string;
    quantityPerItem: string;
    pricePerProduct: string;
    rating: string | null;
    ratingCount: string | null;
  }
  
  interface ProductListProps {
    combinedData: FundedEventWithRating[];
    setSelectedProduct: (product: { productID: string; quantity: string; price: string } | null) => void;
  }
  
  function ProductList({ combinedData, setSelectedProduct }: ProductListProps) {
    return (
      <div>
        <h2 className="text-xl mb-4">Products</h2>
        {combinedData.length > 0 ? (
          <ul className="space-y-2">
            {combinedData.map((item, index) => (
              <li
                key={index}
                className="p-4 border cursor-pointer border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200"
                onClick={() => setSelectedProduct({ productID: item.productID, quantity: '', price: item.pricePerProduct })}
              >
                Product ID: {item.productID}, Quantity: {item.quantityPerItem}, Price: {item.pricePerProduct}
                {item.rating && item.ratingCount && <span>, Rating: {item.rating}, Rating Count: {item.ratingCount}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    );
  }
  
  export default ProductList;