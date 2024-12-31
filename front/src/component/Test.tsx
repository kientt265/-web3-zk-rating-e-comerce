import React from 'react';
import { BrowserProvider, Contract, formatEther, parseEther, Signer} from 'ethers'
import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
interface TestProps {
  walletProvider: any;
}

const Test = () => {
  const contractAdr =
    import.meta.env.VITE_CONTRACT_ADDRESS_SAVE_MERKLE_ROOT || '';
  const contractABI = JSON.parse(
    import.meta.env.VITE_CONTRACT_ABI_SAVE_MERKLE_ROOT || '[]'
  );
  const { walletProvider } = useWeb3ModalProvider();
  const confirmDeal = async () => {
    if (walletProvider) {
      try {
        
        // Lấy signer từ walletProvider
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);
        const blockNum = 109
        // Gọi hàm getMerkleRoot (giả sử đây là hàm view)
        const merkleRoot = await contract.getRootByBlockNuber(blockNum);
        await merkleRoot.wait();
        console.log('Merkle root:', merkleRoot);

      } catch (error) {
        console.error('Error confirming deal:', error);
        alert('Error confirming deal, please try again!');
      } finally {
        // Có thể xử lý thêm trong phần này nếu cần
      }
    }
  };

  return (
    <div>
      <button onClick={confirmDeal} className='bg-blue-600 border-separate'>
        Confirm Deal
      </button>
    </div>
  );
};

export default Test;
