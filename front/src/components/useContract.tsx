import { BrowserProvider, Contract } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { useState } from 'react';

export function useContract(contractAddress: string, contractABI: any) {
  const { walletProvider } = useWeb3ModalProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getContract = async () => {
    if (!walletProvider) {
      throw new Error("Wallet provider not found");
    }

    const browserProvider = new BrowserProvider(walletProvider);
    const signer = await browserProvider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  };

  return {
    getContract,
    isLoading,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    walletProvider
  };
}