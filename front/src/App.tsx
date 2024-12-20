import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther} from 'ethers'
import { useEffect, useState } from "react";
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {InteractPrivateChain} from './component/InteractPrivateChain'
import History from './component/History'
import useEthers from "./hooks/useEthers"
import { FundedEvent, DealEvent } from  "./lib/type"
import {contractABI, contractAdr} from "./contract/contractData"
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
      const [selectedProduct, setSelectedProduct] = useState<{ productID: string; quantity: string; price: string } | null>(null); // State to hold selected product and quantity
      const getEventDelivering = async () => {
        if (walletProvider) {
          try {
            const browserProvider = new BrowserProvider(walletProvider);
            const signerProvider = browserProvider.getSigner();
            const contract = new Contract(contractAdr, contractABI, await signerProvider);
            const newQuantityProductEventFilter = contract.filters.DealState();
            const newProductEvents = await contract.queryFilter(
              newQuantityProductEventFilter,
              100
            );
            const events: DealEvent[] = [];
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
      }
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
            const newQuantityProductFilter = contract.filters.NewQuantityProduct();
            const newQuantityProductEvents = await contract.queryFilter(
              newQuantityProductFilter, 20
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

            for (let i = 0; i < newQuantityProductEvents.length; i++) {
              const currentEvent = newQuantityProductEvents[i];
              const productID123 = (currentEvent as any).args[0];
              const updatedQuantity = (currentEvent as any).args[2].toString();
              // const priceOldProduct = formatEther((currentEvent as any).args[2]); 
              const existingProduct = events.find(event => event.productID === productID123);
              if (existingProduct) {
                // Ghi đè updatedQuantity vào phần tử có productID trùng khớp
                existingProduct.quantityPerItem = updatedQuantity;
              }          
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
      const handleCreateDeal = async () => {
        if (!selectedProduct) {
            alert("Please select a product and enter the quantity!");
            return;
        }
    
        if (!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0) {
            alert("Please enter a valid quantity!");
            return;
        }
    
        // Lấy giá trị price từ selectedProduct
        const price = parseFloat(selectedProduct.price);
        const totalPrice = price * parseInt(selectedProduct.quantity); // Tính toán giá trị tổng
    
        setIsLoading(true); // Hiển thị trạng thái loading
        try {
            if (walletProvider) {
                const browserProvider = new BrowserProvider(walletProvider);
                const signerProvider = browserProvider.getSigner();
                const contract = new Contract(contractAdr, contractABI, await signerProvider);
    
                // Thực hiện giao dịch với giá trị tổng
                const transaction = await contract.createDeal(selectedProduct.productID, selectedProduct.quantity, { value: parseEther(totalPrice.toString()) });
                await transaction.wait();
    
                console.log(`Purchased ${selectedProduct.quantity} of product ID: ${selectedProduct.productID} for total price: ${totalPrice}`);
                setIsSuccess(true); // Giao dịch thành công
                setSelectedProduct(null); // Reset sản phẩm được chọn
            } else {
                alert("Wallet provider not found. Please connect your wallet.");
            }
        } catch (error) {
            console.error("Error creating deal:", error);
            alert("Error creating deal, please try again!");
        } finally {
            setIsLoading(false); // Ẩn trạng thái loading
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
                <button  className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                  Hàng Đang Vận Chuyển
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
                <ul className="space-y-2">
                    {products.map((product, index) => (
                        <li className="p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200 cursor-pointer" key={index} onClick={() => setSelectedProduct({ productID: product.productID, quantity: '', price: product.pricePerProduct })}>
                            Product ID: {product.productID}, Quantity: {product.quantityPerItem}, Price: {product.pricePerProduct}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
            {selectedProduct && (
                <div>
                    <input
                        type="number"
                        placeholder="Enter quantity"
                        value={selectedProduct.quantity}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                        className="border p-2 mb-2 w-full"
                    />
                    <button
                        onClick={handleCreateDeal}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    >
                        Purchase
                    </button>
                </div>
            )}
          </div>
        </div>
      );
    }
  
    export default App;    
