import { useState } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther, ethers, hashMessage } from 'ethers';
import { FundedEvent, DealEvent } from '../lib/type';
import { contractABI, contractAdr } from '../contract/contractData';
import { contractAddressRating, contractABIRating } from '../components/Web3Config';

export const useWeb3Interactions = (walletProvider: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ratingEvents, setRatingEvents] = useState<{ productId: string; rating: string; ratingCount: string }[]>([]);
  const [products, setProducts] = useState<FundedEvent[]>([]);
  const [dealState, setDealState] = useState<DealEvent[]>([]);

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
      }
      
      const eventsRating = Array.from(latestEvents.values());
      setRatingEvents(eventsRating);
      return eventsRating;
    } catch (error) {
      console.error("Error fetching rating events:", error);
      throw error;
    }
  };

  const getEventDelivering = async (filterCompleted: boolean | null = null) => {
    if (!walletProvider) {
      throw new Error("Please connect your wallet first.");
    }
    // ... existing getEventDelivering code ...
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

  const createDeal = async (selectedProduct: { productID: string; quantity: string; price: string }) => {
    // ... existing handleCreateDeal code ...
  };

  const confirmDeal = async (dealId: string) => {
    // ... existing confirmDeal code ...
  };

  const signMessage = async (message: string) => {
    if (!walletProvider) throw new Error("No wallet provider");
    
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const addr = await signer.getAddress();
    const msgHash = await hashMessage(message);
    const signature = await signer.signMessage(message);
    const { r, s, v } = ethers.Signature.from(signature);
    
    return { addr, msgHash, r, s, v };
  };

  return {
    isLoading,
    isSuccess,
    ratingEvents,
    products,
    dealState,
    getEventRating,
    getEventDelivering,
    getEventProducts,
    createDeal,
    confirmDeal,
    signMessage
  };
};