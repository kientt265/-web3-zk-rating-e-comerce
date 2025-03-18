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
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Đăng Ký</h2>
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsSeller(true)}
            className={`py-2 px-4 rounded-lg ${isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Seller
          </button>
          <button
            onClick={() => setIsSeller(false)}
            className={`py-2 px-4 rounded-lg ${!isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            User
          </button>
        </div>
        {isSeller ? (
          <div>
            <input
              type="text"
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Shop Email"
              value={shopEmail}
              onChange={(e) => setShopEmail(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleSignupSeller}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              {isLoading ? "Processing..." : "Create Seller"}
            </button>
            {isSuccess && !isLoading && <p className="text-green-500 mt-2">Seller created successfully!</p>}
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Your Age"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleSignupUser}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              {isLoading ? "Processing..." : "Sign Up User"}
            </button>
            {isSuccess && !isLoading && <p className="text-green-500 mt-2">User signed up successfully!</p>}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;