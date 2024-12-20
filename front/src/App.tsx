import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther} from 'ethers'
import { useEffect, useState } from "react";
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {InteractPrivateChain} from './component/InteractPrivateChain'
import History from './component/History'
import useEthers from "./hooks/useEthers"
import { FundedEvent } from  "./lib/type"
const projectId = import.meta.env.VITE_PROJECT_ID;

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
};

const besu = {
  chainId: 1337,
  name: "Besu-network",
  currency: "ETH",
  explorerUrl: "",
  rpcUrl: import.meta.env.VITE_BESU_RPC_URL,
}

const metadata = {
  name: "Crowfunding",
  description: "Website help people donation for me",
  url: "https://mywebsite.com", // custom your domain here
  icons: ["https://avatars.mywebsite.com/"], //custom your logo here
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia, besu],
  projectId,
  enableAnalytics: true,
});
const contractABI = [
  'function createDeal(string memory _productId, uint _amount) payable',
  'function completeDeal(uint _dealId)',
  'function getDealId(address _addressUser) view returns(uint)',
  'event DealCreated(uint dealId, address buyer, string productId, uint amount, uint value)',
  'event DealConfirmed(uint dealId)',
  'event DealCompleted(uint dealId, uint amount, address buyer)',
  'function createSeller(string memory _shopName, string memory _email)',
  'function uploadItems(string memory _productID, uint _quantityPerItem, uint _pricePerProduct)',
  'function getDetailProduct(string memory _productID) view returns(uint, uint)',
  'function SignUp(string memory _name, uint8 _age, string memory _email)',
  'event NewUser(address _address)',
  'event NewProduct(string  _productID, uint _quantityPerItem, uint _pricePerProduct)'
    ]
    const contractAdr = import.meta.env.VITE_CONTRACT_ADDRESS_PRIVATE_COMERCE
  function App() {
      const { address, isConnected } = useWeb3ModalAccount();
      const { walletProvider } = useWeb3ModalProvider();
      const { open } = useWeb3Modal();
    
      const [isLoading, setIsLoading] = useState(false);
      const [isSuccess, setIsSuccess] = useState(false);
    
      const [shopName, setShopName] = useState('');
      const [shopEmail, setShopEmail] = useState('');
      const [userName, setUserName] = useState('');
      const [userAge, setUserAge] = useState('');
      const [userEmail, setUserEmail] = useState('');
      
      // Trạng thái điều khiển việc hiển thị form đăng ký
      const [showSignUpForm, setShowSignUpForm] = useState(false);
      const [isSeller, setIsSeller] = useState(false); // Kiểm tra xem người dùng chọn là Seller hay User
      const [products, setProducts] = useState<FundedEvent[]>([]); // State to hold fetched products
      const getEventProducts = async () => {
        if (walletProvider) {
          try {
            const browserProvider = new BrowserProvider(walletProvider);
            const signerProvider = browserProvider.getSigner();
            const contract = new Contract(contractAdr, contractABI, await signerProvider);
            const newProductEventFilter = contract.filters.NewProduct();
            const newProductEvents = await contract.queryFilter(
              newProductEventFilter,
              20
            );
            const events: FundedEvent[] = [];
            for (let i = 0; i < newProductEvents.length; i++) {
              const currentEvent = newProductEvents[i];

              const eventObj = {
                productID: (currentEvent as any).args[0],
                quantityPerItem: (currentEvent as any).args[1].toString(),
                pricePerProduct: formatEther((currentEvent as any).args[2]),
                blockNumber: currentEvent.blockNumber,
              };
               
              events.push(eventObj);
              
            }
              
            if (events.length !== 0) {
                setProducts(events); // Update state with fetched products
                return events.sort((a, b) => b.blockNumber - a.blockNumber);
            }

          } catch (error) {
            console.error("Error fetching product events:", error);
            return null;  // Trả về null nếu có lỗi
          }
        }
      };
      
      
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
    
      return (
        <div>
          <header className="mx-auto px-2 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">VerifComerce</h1>
              </div>
              <div className="flex gap-4">
                <button className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                  Lịch Sử Mua Hàng
                </button>
                <button onClick={getEventProducts} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                  Mua Hàng
                </button>
                <button
                  onClick={() => setShowSignUpForm(!showSignUpForm)} // Hiển thị form đăng ký khi nhấn nút Sign Up
                  className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => open()} 
                  className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}
                </button>
              </div>
            </div>
          </header>
    
          {showSignUpForm && (
            <div className="px-4 py-8">
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setIsSeller(true)} // Chọn Seller
                  className={`py-2 px-4 rounded-lg ${isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Seller
                </button>
                <button
                  onClick={() => setIsSeller(false)} // Chọn User
                  className={`py-2 px-4 rounded-lg ${!isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  User
                </button>
              </div>
    
              {isSeller ? (
                <div>
                  <h2 className="text-xl mb-4">Sign Up as Seller</h2>
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
                  <h2 className="text-xl mb-4">Sign Up as User</h2>
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
            </div>
          )}
          <div>
            <h2 className="text-xl mb-4">Products</h2>
            {products.length > 0 ? (
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                            Product ID: {product.productID}, Quantity: {product.quantityPerItem}, Price: {product.pricePerProduct}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
          </div>
        </div>
      );
    }
    
    export default App;
    