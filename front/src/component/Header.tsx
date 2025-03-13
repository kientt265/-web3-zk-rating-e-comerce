// src/components/Header.tsx
import { useWeb3Modal } from '@web3modal/ethers/react';
import { shortenAddress } from '../lib/utils';

interface HeaderProps {
  address: string | undefined;
  isConnected: boolean;
  getEventProducts: () => Promise<void>;
  getEventDelivering: (filterCompleted: boolean | null) => Promise<void>;
  handleShowSignUpForm: () => void;
}

function Header({ address, isConnected, getEventProducts, getEventDelivering, handleShowSignUpForm }: HeaderProps) {
  const { open } = useWeb3Modal();

  return (
    <header className="mx-auto px-2 p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">VerifComerce</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <a href="https://sepolia.etherscan.io/address/0x83abF096267849fcDDb7fcAb2DDfbbD636d8eAe8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ContractSaveMerkleRoot</a>
            <a href="https://sepolia.etherscan.io/address/0x204369e4c844de8d5299baa86d62fa76174cd670" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ContractRating</a>
            <a href="https://sepolia.etherscan.io/address/0x3B0637f8E71c4F7993eAA0Ad8944Ae07bfF18034" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ContractVerifyZK</a>
          </div>
          <button onClick={() => getEventDelivering(true)} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">Lịch Sử Mua Hàng</button>
          <button onClick={() => getEventDelivering(false)} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">Hàng Đang Vận Chuyển</button>
          <button onClick={getEventProducts} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">Mua Hàng</button>
          <button onClick={handleShowSignUpForm} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">Sign Up</button>
          <button onClick={() => open()} className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
            {isConnected && address ? shortenAddress(address) : "Connect Wallet"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;