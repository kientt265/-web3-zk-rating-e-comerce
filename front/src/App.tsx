import {  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther, Signer, ethers, hashMessage} from 'ethers'
import { useState } from "react";
import { useWeb3Modal } from '@web3modal/ethers/react'
import Header from './components/Header';
import { FundedEvent, DealEvent, RatingEvent } from  "./lib/type"
import {contractABI, contractAdr} from "./contract/contractData"
import { ComputePubkey } from "./components/ComputePubkey";
import { initWeb3Modal, contractAddressRating, contractABIRating } from './components/Web3Config';
import RatingModal from './components/RatingModal';
import SignUpForm from './components/SignUpForm';
import ProductsList from './components/ProductsList';
import DealStateList from './components/DealStateList';
initWeb3Modal();
  function App() {
      const { address, isConnected } = useWeb3ModalAccount();
      const { walletProvider } = useWeb3ModalProvider();
      const { open } = useWeb3Modal();

      const [isLoading, setIsLoading] = useState(false);
      const [isSuccess, setIsSuccess] = useState(false);

      const [signatureData, setSignatureData] = useState<{
        msgHash: string;
        r: string;
        s: string;
        v: number;
    } | null>(null);

      // Trạng thái điều khiển việc hiển thị form đăng ký
      const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);

      const [products, setProducts] = useState<FundedEvent[]>([]); // State to hold fetched products
      const [dealState, setDealState] = useState<DealEvent[]>([])
      const [selectedProduct, setSelectedProduct] = useState<{ productID: string; quantity: string; price: string } | null>(null); // State to hold selected product and quantity
      const [showRatingInput, setShowRatingInput] = useState<boolean>(false); // Trạng thái để hiển thị ô nhập
      const [dealId, setDealId] = useState<string>(''); // Trạng thái để lưu giá trị ô nhập
      const [productId, setProductId] = useState<string>(''); // Trạng thái để lưu giá trị ô nhập
      const [inputValueRating, setInputValueRating] = useState<string>('') // Trạng thái để lưu giá trị ô nhập
      const [submittedData, setSubmittedData] = useState<{
        dealId: string;
        productId: string;
        rating: string;
        address: string;
        msgHash: string;
        r: string;
        s: string;
        v: number;
        
      } | null>(null);

            const handleSignMessege =  async () => {
              
              if (walletProvider) {
                try {
                  const ethersProvider = new BrowserProvider(walletProvider);
                  const signer = await ethersProvider.getSigner();
                  const addr = (await signer).getAddress();
                  const addr1 = addr.toString();
                  const msgHash = await hashMessage(inputValueRating);
                  console.log("Message Hash: ", msgHash); // In ra msgHash
            
                  // Ký message
                  const signature = await signer.signMessage(inputValueRating);
                  console.log("Signed Message: ", signature); // Hiển thị chữ ký
            
                  // Tách r, s, v từ chữ ký
                  const { r, s, v } = ethers.Signature.from(signature);
                  setSignatureData({msgHash, r, s, v});
                  console.log("r:", r); // In ra phần r
                  console.log("s:", s); // In ra phần s
                  console.log("v:", v); // In ra phần vsignatureData
                  handleSubmit(addr1, msgHash, r, s, v);
                } catch (error) {
                  console.error("Error signing message: ", error);
                }
              }
      
            }
      
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
        console.time("handleCreateDeal"); // Bắt đầu đo thời gian
    
        if (!selectedProduct) {
            alert("Please select a product and enter the quantity!");
            console.timeEnd("handleCreateDeal"); // Kết thúc đo thời gian
            return;
        }
    
        if (!selectedProduct.quantity || parseInt(selectedProduct.quantity) <= 0) {
            alert("Please enter a valid quantity!");
            console.timeEnd("handleCreateDeal"); // Kết thúc đo thời gian
            return;
        }
    
        // Lấy giá trị price từ selectedProduct
        const price = parseFloat(selectedProduct.price);
        const totalPrice = price * parseInt(selectedProduct.quantity); // Tính toán giá trị tổng
    
        setIsLoading(true); // Hiển thị trạng thái loading
        try {
            console.time("transactionTime"); // Bắt đầu đo thời gian giao dịch
            if (walletProvider) {
                const browserProvider = new BrowserProvider(walletProvider);
                const signerProvider = browserProvider.getSigner();
                const contract = new Contract(contractAdr, contractABI, await signerProvider);
    
                // Thực hiện giao dịch với giá trị tổng
                const transaction = await contract.createDeal(selectedProduct.productID, selectedProduct.quantity, { value: parseEther(totalPrice.toString()) });
                await transaction.wait();
                console.timeEnd("transactionTime"); // Kết thúc đo thời gian giao dịch
    
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
            console.timeEnd("handleCreateDeal"); // Kết thúc đo thời gian
        }
    };
      const handleShowRatingInput = (dealId: string, productId: string) => {
        setDealId(dealId);
        setProductId(productId);
        setShowRatingInput(true); 
      };
      const handleSubmit = (addr: string, msgHash: string, r: string, s: string, v: number) => {
        const data = {
          dealId,
          productId,
          rating: inputValueRating,
          address: addr,
          msgHash: msgHash,
          r: r,
          s: s,
          v: v
        };
        setSubmittedData(data);
        console.log("DATAAAAAA", data)
        // console.log("DATAAAAA@@@", submittedData) // Lưu giá trị vào state để truyền vào component GetInput
        setShowRatingInput(false); // Đóng modal
      };
      const handleShowSignUpForm = () => {
        setShowSignUpForm(true); // Hiển thị form đăng ký
      };

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
         
        <Header 
          address={address}
          isConnected={isConnected}
          onOpenWallet={open}
          onShowSignUp={handleShowSignUpForm}
          onGetProducts={getEventProducts}
          onGetDelivering={getEventDelivering}
        />
          {/* <GetInput signer = {} dealId = {} /> */}
          {submittedData && (
            <div>
              {/* <GetInput dealId={submittedData.dealId} productId = {submittedData.productId} rating = {submittedData.rating}  /> */
              <ComputePubkey dealId={submittedData.dealId} productId = {submittedData.productId} rating = {submittedData.rating} address = {submittedData.address} msgHash={submittedData.msgHash} r={submittedData.r} s={submittedData.s} v={submittedData.v} />}
            </div>
            
          )}
          <SignUpForm 
        isOpen={showSignUpForm}
        onClose={() => setShowSignUpForm(false)}
        walletProvider={walletProvider}
        contractABI={contractABI}
        contractAdr={contractAdr}
      />

  
          <div>
          <DealStateList 
          deals={dealState}
          onConfirmDeal={comfirmDeal}
          onShowRating={handleShowRatingInput}
        />       
        <ProductsList 
          combinedData={combinedData}
          onSelectProduct={setSelectedProduct}
          selectedProduct={selectedProduct}
          onQuantityChange={(quantity) => 
            setSelectedProduct(prev => prev ? { ...prev, quantity } : null)
          }
          onPurchase={handleCreateDeal}
          isLoading={isLoading}
        />
          </div>
       
         <RatingModal 
                                        isOpen={showRatingInput}
                                        onClose={() => setShowRatingInput(false)}
                                        onSubmit={() => {
                                            handleSignMessege();
                                            setShowRatingInput(false);
                                        }}
                                        rating={inputValueRating}
                                        onRatingChange={(value) => setInputValueRating(value)}
                                    />
        
        </div>
      );
    }
  
    export default App;
