import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther, Signer, ethers, hashMessage } from 'ethers'
import { useState } from "react";
import { useWeb3Modal } from '@web3modal/ethers/react'
import Header from './components/Header';
import { FundedEvent, DealEvent, RatingEvent } from "./lib/type"
import { contractABI, contractAdr } from "./contract/contractData"
import { ComputePubkey } from "./components/ComputePubkey";
import { initWeb3Modal, contractAddressRating, contractABIRating } from './components/Web3Config';
import RatingModal from './components/RatingModal';
import SignUpForm from './components/SignUpForm';
import ProductsList from './components/ProductsList';
import DealStateList from './components/DealStateList';
import { useEventHandlers } from './hooks/useEventHandlers';
import { useAppState } from './hooks/useAppState';
import  ProductsAndDeals  from './components/ProductsAndDeals';
initWeb3Modal();
function App() {
  const appState = useAppState();
  const {
    isLoading, setIsLoading,
    isSuccess, setIsSuccess,
    dealState, setDealState,
    showSignUpForm, setShowSignUpForm,
    products, setProducts,
    selectedProduct, setSelectedProduct,
    showRatingInput, setShowRatingInput,
    dealId, setDealId,
    productId, setProductId,
    inputValueRating, setInputValueRating,
    ratingEvents, setRatingEvents,
    signatureData, setSignatureData,
    submittedData, setSubmittedData,
    comment, setComment,
    images, setImages,
    showDealState, setShowDealState,
    showProduct, setShowProduct
  } = appState;

  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const {
    handleCreateDeal,
    getEventRating,
    getEventProducts,
    getEventDelivering,
    handleSignMessege,
    handleSubmit
  } = useEventHandlers(walletProvider, appState);
  const { open } = useWeb3Modal();
  const comfirmDeal = async (dealId: string) => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);

        const transaction = await contract.completeDeal(dealId);
        await transaction.wait();
        //nullifier = poseidon(dealId, productId, privateKey);
        // const data = {
        //  nullifier: nullifier
        // };
        // const response = await fetch("http://localhost:3000/api/nullifier", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(data),
        // });
        setIsSuccess(true);
      } catch (error) {
        console.error("Error confirming deal:", error);
        alert("Error confirming deal, please try again!");
      } finally {
        setIsLoading(false);
      }
    }
  }
  const handleShowRatingInput = (dealId: string, productId: string) => {
    setDealId(dealId);
    setProductId(productId);
    setShowRatingInput(true);
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
  const [activeView, setActiveView] = useState<'products' | 'deals'>('products');

  return (
    <div>
      <Header
        address={address}
        isConnected={isConnected}
        onOpenWallet={open}
        onShowSignUp={handleShowSignUpForm}
        onGetProducts={getEventProducts}
        onGetDelivering={getEventDelivering}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      {/* <GetInput signer = {} dealId = {} /> */}
      {submittedData && (
        <div>
          {/* <GetInput dealId={submittedData.dealId} productId = {submittedData.productId} rating = {submittedData.rating}  /> */
            <ComputePubkey dealId={submittedData.dealId} productId={submittedData.productId} rating={submittedData.rating} address={submittedData.address} msgHash={submittedData.msgHash} r={submittedData.r} s={submittedData.s} v={submittedData.v} comment={submittedData.comment} images={submittedData.images}/>}
        </div>

      )}
      <SignUpForm
        isOpen={showSignUpForm}
        onClose={() => setShowSignUpForm(false)}
        walletProvider={walletProvider}
        contractABI={contractABI}
        contractAdr={contractAdr}
      />

            <ProductsAndDeals
        combinedData={combinedData}
        onSelectProduct={setSelectedProduct}
        selectedProduct={selectedProduct}
        onQuantityChange={(quantity) =>
          setSelectedProduct(prev => prev ? { ...prev, quantity } : null)
        }
        onPurchase={handleCreateDeal}
        isLoading={isLoading}
        onGetProducts={getEventProducts}
        deals={dealState}
        onConfirmDeal={comfirmDeal}
        onShowRating={handleShowRatingInput}
        activeView={activeView}
        onGetDelivering={getEventDelivering}
      />
      <RatingModal
        isOpen={showRatingInput}
        onClose={() => setShowRatingInput(false)}
        onSubmit={() => {
          handleSignMessege();
          setShowRatingInput(false);
        }}
        rating={inputValueRating}
        commentRating={comment}
        imagesRating={images}
        onRatingChange={(value) => setInputValueRating(value)}
        onCommentChange={(value) => setComment(value)}
        onImagesChange={(files) => setImages(files)}
      />

    </div>
  );
}

export default App;
