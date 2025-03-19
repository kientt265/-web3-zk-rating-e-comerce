import React, { FC, useState, useEffect } from 'react';
import { FundedEvent } from '../lib/type';
 interface ReviewImage {
  _id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: string;
}
 interface ProductReview {
  dealId: string;
  comment: string;
  images: ReviewImage[];
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
  const [showAllReviews, setShowAllReviews] = useState(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [product.productID]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-8">
            <img 
            //   src={product.imageUrl || ''} 
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

        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-6">Reviews</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {displayedReviews.map((review, index) => (
                <div key={review.dealId} className="border-b border-gray-200 pb-6">
                  <p className="text-gray-600 mb-4">{review.comment}</p>
                  <div className="flex gap-2 flex-wrap">
                    {review.images.map((img) => (
                      <img 
                        key={img._id}
                        src={`http://localhost:3000${img.path}`}
                        alt={img.filename}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
          
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold transition duration-200"
            >
              {showAllReviews ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
