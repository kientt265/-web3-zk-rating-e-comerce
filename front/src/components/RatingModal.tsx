interface RatingModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    rating: string;
    onRatingChange: (value: string) => void;
  }
  
  export function RatingModal({ show, onClose, onSubmit, rating, onRatingChange }: RatingModalProps) {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg mb-4">Rating</h2>
          <input
            type="text"
            placeholder="1* to 5*"
            value={rating}
            onChange={(e) => onRatingChange(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }