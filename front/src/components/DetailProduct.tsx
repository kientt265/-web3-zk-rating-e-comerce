import React, { FC, useState, useEffect } from 'react';
import { FundedEvent } from '../lib/type';

interface ProductReview {
  rating: number;
  comment: string;
  images: string; // string (URL hoặc base64)
}

interface DetailProductProps {
  product: FundedEvent & {
    rating: string | null;
    ratingCount: string | null;
  };
  onClose: () => void;
}

export const DetailProduct: FC<DetailProductProps> = ({ product, onClose }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/ratings/${product.productID}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [product.productID]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Thông tin sản phẩm */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-8">
            <img
              alt={`Product ${product.productID}`}
              className="w-72 h-72 object-cover rounded-xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Product #{product.productID}</h2>
              <p className="text-2xl font-semibold text-blue-600 mb-4">{product.pricePerProduct} ETH</p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Description</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Danh sách đánh giá */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-6">Reviews</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-6 flex items-start gap-4">
                  {/* Icon user bên trái */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // Đường dẫn icon user từ Flaticon
                    alt="user icon"
                    className="w-10 h-10 object-cover rounded-full mt-1"
                  />
                  <div className="flex-1">
                    {/* Hiển thị rating bằng icon ngôi sao */}
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <svg
                          key={starIdx}
                          className={`w-6 h-6 ${starIdx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-600 mb-4">{review.comment}</p>
                    {review.images && (
                      <img
                        src={review.images.startsWith('http') ? review.images : `http://localhost:3000${review.images}`}
                        alt="review-img"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
