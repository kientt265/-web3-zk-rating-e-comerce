import { FC, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

interface SignUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  walletProvider: any;
  contractABI: any;
  contractAdr: string;
}

const SignUpForm: FC<SignUpFormProps> = ({
  isOpen,
  onClose,
  walletProvider,
  contractABI,
  contractAdr
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleSignupSeller = async () => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);

        const transaction = await contract.createSeller(shopName, shopEmail);
        await transaction.wait();

        setIsSuccess(true);
      } catch (error) {
        console.error("Error creating seller:", error);
        alert("Error creating seller, please try again!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignupUser = async () => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);

        const transaction = await contract.SignUp(userName, parseInt(userAge), userEmail);
        await transaction.wait();

        setIsSuccess(true);
      } catch (error) {
        console.error("Error signing up user:", error);
        alert("Error signing up user, please try again!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h2>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsSeller(true)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              isSeller 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Seller
          </button>
          <button
            onClick={() => setIsSeller(false)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              !isSeller 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            User
          </button>
        </div>

        {isSeller ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Email</label>
              <input
                type="email"
                placeholder="Enter shop email"
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={isSeller ? handleSignupSeller : handleSignupUser}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isSeller ? "Create Seller Account" : "Create User Account"
            )}
          </button>
        </div>

        {isSuccess && !isLoading && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 text-center font-medium">
              {isSeller ? "Seller account created successfully!" : "User account created successfully!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;