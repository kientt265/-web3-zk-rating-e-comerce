import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther, Signer, ethers} from 'ethers'
import { useEffect, useState } from "react";
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {InteractPrivateChain} from './component/InteractPrivateChain'
import History from './component/History'
import useEthers from "./hooks/useEthers"
import GetInput from "./component/GetInput";
import { FundedEvent, DealEvent, RatingEvent } from  "./lib/type"
import {contractABI, contractAdr} from "./contract/contractData"
import Test from "./component/Test";
const projectId = import.meta.env.VITE_PROJECT_ID;

const contractAddressRating = import.meta.env.VITE_CONTRACT_ADDRESS_RATING || "0x84aD7B5667E4eBD82149Cd484e2E54a0f17cc79c";
const contractABIRating = JSON.parse(import.meta.env.VITE_CONTRACT_ABI_RATING || "[]");
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
      const [testDealId, setTestDealId] = useState('');
      const [shopName, setShopName] = useState('');
      const [shopEmail, setShopEmail] = useState('');
      const [userName, setUserName] = useState('');
      const [userAge, setUserAge] = useState('');
      const [userEmail, setUserEmail] = useState('');
      
      // Trạng thái điều khiển việc hiển thị form đăng ký
      const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);
      const [isSeller, setIsSeller] = useState(false); // Kiểm tra xem người dùng chọn là Seller hay User
      const [products, setProducts] = useState<FundedEvent[]>([]); // State to hold fetched products
      const [dealState, setDealState] = useState<DealEvent[]>([])
      const [ratingState, setRatingState] = useState<RatingEvent[]>([])
      // const [selectDealState, setSelectDealState] = useState<{
      //   dealId: string;
      //   buyer: string;
      //   productID: string;
      //   amount: string;
      //   value: string;
      //   isCompleted: boolean} | null>(null);
      const [selectedProduct, setSelectedProduct] = useState<{ productID: string; quantity: string; price: string } | null>(null); // State to hold selected product and quantity
      const [showRatingInput, setShowRatingInput] = useState<boolean>(false); // Trạng thái để hiển thị ô nhập
      const [dealId, setDealId] = useState<string>(''); // Trạng thái để lưu giá trị ô nhập
      const [productId, setProductId] = useState<string>(''); // Trạng thái để lưu giá trị ô nhập
      const [inputValuePrivateKey, setInputValuePrivateKey] = useState<string>('');
      const [inputValueRating, setInputValueRating] = useState<string>('') // Trạng thái để lưu giá trị ô nhập
      const [submittedData, setSubmittedData] = useState<{
        dealId: string;
        productId: string;
        rating: string;
        password: string;
      } | null>(null);
      // const toggleShowRatingInput = async (productId: string) => {
        
      // }
      const comfirmDeal = async (dealId: string) => {
        setIsLoading(true);
        if (walletProvider) {
          try {
            const browserProvider = new BrowserProvider(walletProvider);
            const signerProvider = browserProvider.getSigner();
            const contract = new Contract(contractAdr, contractABI, await signerProvider);
    
            const transaction = await contract.completeDeal(dealId);
            await transaction.wait();
    
            setIsSuccess(true);
          } catch (error) {
            console.error("Error confirming deal:", error);
            alert("Error confirming deal, please try again!");
          } finally {
            setIsLoading(false);
          }
        }
      }
      const [ratingEvents, setRatingEvents] = useState<{ productId: string; rating: string; ratingCount: string }[]>([]);

      const getEventRating = async () => {
        try {
            const providerURL = import.meta.env.VITE_SEPOLIA_RPC_URL || "";
            const provider = new ethers.JsonRpcProvider(providerURL);
    
            const contractRating = new Contract(contractAddressRating, contractABIRating, provider);
            const ratingEventFilter = contractRating.filters.NewRating();
            const newRatingEvents = await contractRating.queryFilter(ratingEventFilter, 10);
    
            const latestEvents = new Map<string, { productId: string; rating: string; ratingCount: string }>();
    
            for (const event of newRatingEvents) {
                const newEvent = {
                    productId: (event as any).args[0].toString(),
                    rating: (event as any).args[1].toString(),
                    ratingCount: (event as any).args[2].toString(),
                };
            
                latestEvents.set(newEvent.productId, newEvent);
                console.log("Processing Event:", newEvent);
            }
    
            const eventsRating = Array.from(latestEvents.values());
            setRatingEvents(eventsRating);
            console.log("Latest Events:", eventsRating);
    
        } catch (error) {
            console.error("Error fetching deal state events:", error);
            alert("An error occurred while fetching deal state events. Please try again.");
        }
    };
    
    
      const getEventDelivering = async (filterCompleted: boolean | null = null) => {
        if (!walletProvider) {
          alert("Please connect your wallet first.");
          return;
        }
        try {
          const browserProvider = new BrowserProvider(walletProvider);
          const signerProvider = browserProvider.getSigner();
          const addr = (await signerProvider).getAddress(); // Lấy địa chỉ người dùng
          const contract = new Contract(contractAdr, contractABI, await signerProvider);
          const eventsDeal = [...dealState]; 
          const dealStateEventFilter = contract.filters.DealState();
          const newDealStateEvent = await contract.queryFilter(dealStateEventFilter, 10);
      
          for (let i = 0; i < newDealStateEvent.length; i++) {
            const currentEvent = newDealStateEvent[i];
            const newEvent = {
              dealId: (currentEvent as any).args[0].toString(),
              buyer: (currentEvent as any).args[1].toString(),
              productID: (currentEvent as any).args[2],
              amount: (currentEvent as any).args[3].toString(),
              value: formatEther((currentEvent as any).args[4]),
              isCompleted: (currentEvent as any).args[5],
              blockNumber: currentEvent.blockNumber,
            };
      
            // Chỉ xử lý các sự kiện có buyer trùng với địa chỉ của người dùng
            if (newEvent.buyer.toLowerCase() === (await addr).toLowerCase()) {
              // Tìm chỉ số của sự kiện đã tồn tại với dealId tương ứng
              const existingIndex = eventsDeal.findIndex(event => event.dealId === newEvent.dealId);
      
              if (existingIndex !== -1) {
                // Ghi đè sự kiện đã tồn tại bằng sự kiện mới
                eventsDeal[existingIndex] = newEvent;
              } else {
                // Thêm sự kiện mới vào danh sách
                eventsDeal.push(newEvent);
              }
            }
          }
      
          let filteredEvents = eventsDeal;
      
          // Lọc dựa trên trạng thái hoàn thành nếu được chỉ định
          if (filterCompleted !== null) {
            filteredEvents = filteredEvents.filter(event => event.isCompleted === filterCompleted);
          }
      
          if (filteredEvents.length !== 0) {
            // Sắp xếp các sự kiện theo blockNumber giảm dần
            const sortedEvents = filteredEvents.sort((a, b) => b.blockNumber - a.blockNumber);
            setDealState(sortedEvents);
            return sortedEvents;
          } else {
            console.log("No events found.");
            alert("No deal state events found.");
          }
        } catch (error) {
          console.error("Error fetching deal state events:", error);
          alert("An error occurred while fetching deal state events. Please try again.");
        }
      };
      
      
      const getEventProducts = async () => {
        if (walletProvider) {
          try {
            const browserProvider = new BrowserProvider(walletProvider);
            const signerProvider = browserProvider.getSigner();
            
            const contract = new Contract(contractAdr, contractABI, await signerProvider);
            const newProductEventFilter = contract.filters.NewProduct();
            const newProductEvents = await contract.queryFilter(
              newProductEventFilter,
              10
            );
            const newQuantityProductFilter = contract.filters.NewQuantityProduct();
            const newQuantityProductEvents = await contract.queryFilter(
              newQuantityProductFilter, 10
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

            const ratingEvents = await getEventRating();
            console.log("Rating Events:", ratingEvents);

              
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
                console.log("Transaction hash:", transaction);
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
    
      const handleShowRatingInput = (dealId: string, productId: string) => {
        setDealId(dealId);
        setProductId(productId);
        setShowRatingInput(true); 
      };
      const handleSubmit = () => {
        const data = {
          dealId,
          productId,
          rating: inputValueRating,
          password: inputValuePrivateKey,
        };
        setSubmittedData(data);
        console.log("DATAAAAAA", data)
        // console.log("DATAAAAA@@@", submittedData) // Lưu giá trị vào state để truyền vào component GetInput
        setShowRatingInput(false); // Đóng modal
      };
      const handleShowSignUpForm = () => {
        setShowSignUpForm(true); // Hiển thị form đăng ký
      };
      // const getSigner = async () => {
      //   setIsLoading(true);
      //   if (walletProvider) {
      //     try {
      //       const browserProvider = new BrowserProvider(walletProvider);
      //       const signerProvider = browserProvider.getSigner();
            
      //       // setSigner(await signerProvider);
      //       setIsSuccess(true);
      //     } catch (error) {
      //       console.error("Error getting signer:", error);
      //       alert("Error getting signer, please try again!");
      //     } finally {
      //       setIsLoading(false);
      //     }
      //   }
      // }

      const combinedData = products.map(product => {
        const ratingEvent = ratingEvents.find(event => event.productId === product.productID);
        return {
            ...product,
            rating: ratingEvent ? ratingEvent.rating : null,
            ratingCount: ratingEvent ? ratingEvent.ratingCount : null,
        };
    });

      return (
        <div>
          <header className="mx-auto px-2 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">VerifComerce</h1>
              </div>
              <div className="flex gap-4">
              <div className="flex  gap-4">
                <a 
                  href="https://sepolia.etherscan.io/address/0x83abF096267849fcDDb7fcAb2DDfbbD636d8eAe8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  ContractSaveMerkleRoot
                </a>
                <a 
                  href="https://sepolia.etherscan.io/address/0x84aD7B5667E4eBD82149Cd484e2E54a0f17cc79c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  ContractRating
                </a>
                <a 
                  href="https://sepolia.etherscan.io/address/0x3B0637f8E71c4F7993eAA0Ad8944Ae07bfF18034" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  ContractVerifyZK
                </a>
                
              </div>
              {/* <button
                onClick={() => getEventRating()}
                className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                Lấy events Rating
              </button> */}
              <button
                onClick={() => getEventDelivering(true)}
                className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                Lịch Sử Mua Hàng
              </button>
              <button
                onClick={() => getEventDelivering(false)}
                className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Hàng Đang Vận Chuyển
              </button>


                <button onClick={getEventProducts} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                  Mua Hàng
                </button>
                <button 
                  onClick={handleShowSignUpForm} // Gọi hàm để hiển thị form đăng ký
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
          {/* <GetInput signer = {} dealId = {} /> */}
          {submittedData && (
            <div>
              {/* <p>Deal ID: {submittedData.dealId}</p>
              <p>Product ID: {submittedData.productId}</p>
              <p>Rating: {submittedData.rating}</p>
              <p>Password: {submittedData.password}</p> */}
              <GetInput dealId={submittedData.dealId} productId = {submittedData.productId} rating = {submittedData.rating} password = {submittedData.password} />
            </div>
            
          )}

          {showSignUpForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl mb-4">Đăng Ký</h2>
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
                        onClick={() => setShowSignUpForm(false)} // Đóng form đăng ký
                        className="mt-4 ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
                    >
                        Hủy
                    </button>
                </div>
            </div>
          )}
          <div>
          <h2 className="text-xl mb-4">Deal State Events</h2>
            {dealState.length > 0 ? (
                    <ul className="space-y-2">
                        {dealState.map((dealState, index) => (
                            <li key={index} className="p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200 cursor-pointer">
                                Deal ID: {dealState.dealId}, Buyer: {dealState.buyer}, Product ID: {dealState.productID}, Amount: {dealState.amount}, Value: {dealState.value}, Completed: {dealState.isCompleted ? "Yes" : "No"}
                                {!dealState.isCompleted && (
                                    <button 
                                        onClick={() => comfirmDeal(dealState.dealId)}
                                        className="ml-4 bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-400 transition-colors"
                                    >
                                        Đã Nhận được Hàng
                                    </button>
                                )}
                                {dealState.isCompleted && (
                                    <button 
                                        onClick={() => handleShowRatingInput(dealState.dealId, dealState.productID)} // Gọi hàm để hiển thị ô nhập
                                        className="ml-4 bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-400 transition-colors"
                                    >
                                        Đánh giá sản phẩm
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
               
            ): (
              <p>Bạn chưa mua gì</p>
          )}
            <h2 className="text-xl mb-4">Products</h2>
            {combinedData.length > 0 ? (
                <ul className="space-y-2">
                    {combinedData.map((item, index) => (
                        <li key={index} className="p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200">
                            Product ID: {item.productID}, Quantity: {item.quantityPerItem}, Price: {item.pricePerProduct}
                            {item.rating && item.ratingCount && (
                                <span>, Rating: {item.rating}, Rating Count: {item.ratingCount}</span>
                            )}
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
                        disabled={!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0}
                        className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                    >
                        Purchase
                    </button>
                </div>
            )}
          </div>
          {showRatingInput && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg mb-4">Rating</h2>
                    <input
                        type="password"
                        placeholder="Enter Your Password"
                        value={inputValuePrivateKey}
                        onChange={(e) => setInputValuePrivateKey(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />
                    <input
                        type="text"
                        placeholder="1* to 5*"
                        value={inputValueRating}
                        onChange={(e) => setInputValueRating(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />
                    <button
                        onClick={() => {
                            handleSubmit();
                            // Xử lý logic gửi đánh giá ở đây
                            setShowRatingInput(false); // Ẩn ô nhập sau khi gửi
                        }}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    >
                        Send
                    </button>
                    <button
                        onClick={() => setShowRatingInput(false)} // Đóng ô nhập
                        className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}
        
        {/* <div>
            <h2 className="text-xl mb-4">Rating Events</h2>
            {ratingEvents.length > 0 ? (
                <ul className="space-y-2">
                    {ratingEvents.map((event, index) => (
                        <li key={index} className="p-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 hover:shadow-lg transition duration-200">
                            Product ID: {event.productId}, Rating: {event.rating}, Rating Count: {event.ratingCount}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rating events found.</p>
            )}
        </div> */}
        
        </div>
      );
    }
  
    export default App;    
