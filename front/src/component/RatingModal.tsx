// src/components/RatingModal.tsx
interface RatingModalProps {
    showRatingInput: boolean;
    setShowRatingInput: (value: boolean) => void;
    inputValuePrivateKey: string;
    setInputValuePrivateKey: (value: string) => void;
    inputValueRating: string;
    setInputValueRating: (value: string) => void;
    handleSubmit: () => void;
  }
  
  function RatingModal({
    showRatingInput,
    setShowRatingInput,
    inputValuePrivateKey,
    setInputValuePrivateKey,
    inputValueRating,
    setInputValueRating,
    handleSubmit,
  }: RatingModalProps) {
    if (!showRatingInput) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg mb-4">Rating</h2>
          <input type="password" placeholder="Enter Your Password" value={inputValuePrivateKey} onChange={(e) => setInputValuePrivateKey(e.target.value)} className="border p-2 mb-4 w-full" />
          <input type="text" placeholder="1* to 5*" value={inputValueRating} onChange={(e) => setInputValueRating(e.target.value)} className="border p-2 mb-4 w-full" />
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Send</button>
          <button onClick={() => setShowRatingInput(false)} className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
        </div>
      </div>
    );
  }
  
  export default RatingModal;