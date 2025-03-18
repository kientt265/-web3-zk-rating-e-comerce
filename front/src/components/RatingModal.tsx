import { FC } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rating: string;
  onRatingChange: (value: string) => void;
}

const RatingModal: FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rating,
  onRatingChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Product Rating</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating Score
            </label>
            <input
              type="text"
              placeholder="Enter rating (1-5 stars)"
              value={rating}
              onChange={(e) => onRatingChange(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              placeholder="Write your review here..."
              className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-blue-500 hover:text-blue-600">
                  <span className="block mb-2">📸 Click to upload images</span>
                  <span className="text-sm text-gray-500">or drag and drop</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;