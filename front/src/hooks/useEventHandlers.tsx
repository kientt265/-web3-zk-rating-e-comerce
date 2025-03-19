import { BrowserProvider, Contract, formatEther, parseEther, ethers, hashMessage } from 'ethers';
import { contractABI, contractAdr } from "../contract/contractData";
import { contractAddressRating, contractABIRating } from '../components/Web3Config';
import { FundedEvent, DealEvent, RatingEvent } from  "../lib/type"
export function useEventHandlers(walletProvider: any, appState: any) {
    const {
        setIsLoading, setIsSuccess, setProducts, setDealState,
        setSelectedProduct, setShowRatingInput, dealId, productId,
        inputValueRating, setSubmittedData, setSignatureData,
        setRatingEvents, dealState, selectedProduct, comment, images
    } = appState;

    const handleSignMessege = async () => {
        if (walletProvider) {
            try {
                const ethersProvider = new BrowserProvider(walletProvider);
                const signer = await ethersProvider.getSigner();
                const addr = await signer.getAddress();
                const addr1 = addr.toString();
                const msgHash = await hashMessage(inputValueRating);
                
                const signature = await signer.signMessage(inputValueRating);
                const { r, s, v } = ethers.Signature.from(signature);
                
                setSignatureData({msgHash, r, s, v});
                handleSubmit(addr1, msgHash, r, s, v);
            } catch (error) {
                console.error("Error signing message: ", error);
            }
        }
    };

    const getEventRating = async () => {
        try {
            const providerURL = import.meta.env.VITE_SEPOLIA_RPC_URL || "";
            const provider = new ethers.JsonRpcProvider(providerURL);
    
            const contractRating = new Contract(contractAddressRating, contractABIRating, provider);
            const ratingEventFilter = contractRating.filters.NewRating();
            const newRatingEvents = await contractRating.queryFilter(ratingEventFilter, 10);
    
            // Tạo Map để lưu trữ tổng rating và số lượng rating cho mỗi sản phẩm
            const productRatings = new Map<string, { totalRating: number; count: number }>();
    
            // Tính tổng rating và đếm số lượng rating cho mỗi sản phẩm
            for (const event of newRatingEvents) {
                const productId = (event as any).args[0].toString();
                const rating = parseFloat((event as any).args[1].toString());
                
                if (!productRatings.has(productId)) {
                    productRatings.set(productId, { totalRating: 0, count: 0 });
                }
                
                const current = productRatings.get(productId)!;
                current.totalRating += rating;
                current.count += 1;
                productRatings.set(productId, current);
            }
    
            // Chuyển đổi thành mảng các đối tượng với rating trung bình
            const eventsRating = Array.from(productRatings.entries()).map(([productId, data]) => ({
                productId,
                rating: (data.totalRating / data.count).toFixed(1), // Làm tròn đến 1 chữ số thập phân
                ratingCount: data.count.toString()
            }));
    
            setRatingEvents(eventsRating);
            console.log("Average Ratings:", eventsRating);
    
        } catch (error) {
            console.error("Error fetching rating events:", error);
            alert("An error occurred while fetching rating events. Please try again.");
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

    const handleSubmit = (addr: string, msgHash: string, r: string, s: string, v: number) => {
        const data = {
            dealId,
            productId,
            rating: inputValueRating,
            address: addr,
            msgHash,
            r,
            s,
            v,
            comment: comment,
            images: images
        };
        setSubmittedData(data);
        setShowRatingInput(false);
    };

    return {
        handleSignMessege,
        getEventRating,
        getEventProducts,
        getEventDelivering,
        handleCreateDeal,
        handleSubmit
    };
}