import { FundedEvent } from '../lib/type';

interface ProductListProps {
  combinedData: (FundedEvent & {
    rating: string | null;
    ratingCount: string | null;
  })[];
  onSelectProduct: (product: { productID: string; quantity: string; price: string }) => void;
}

export function ProductList({ combinedData, onSelectProduct }: ProductListProps) {
  if (combinedData.length === 0) {
    return <p>No products found.</p>;
  }

  return (
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
  );
}