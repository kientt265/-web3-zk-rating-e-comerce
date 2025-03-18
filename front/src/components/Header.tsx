import { useWeb3Modal } from '@web3modal/ethers/react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { shortenAddress } from '../lib/utils'

interface HeaderProps {
  onGetProducts: () => void;
  onGetDelivering: (completed: boolean) => void;
  onShowSignUpForm: () => void;
}

export function Header({ onGetProducts, onGetDelivering, onShowSignUpForm }: HeaderProps) {
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  return (
    <header className="mx-auto px-2 p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">VerifComerce</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <a 
              href="https://sepolia.etherscan.io/address/0x83abF096267849fcDDb7fcAb2DDfbbD636d8eAe8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ContractSaveMerkleRoot
            </a>
            <a 
              href="https://sepolia.etherscan.io/address/0x204369e4c844de8d5299baa86d62fa76174cd670" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ContractRating
            </a>
            <a 
              href="https://sepolia.etherscan.io/address/0x48985c6aADB9Fd141c8D9962D78d75Df18d5deE7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ContractVerifyZK
            </a>
          </div>
          <button
            onClick={() => onGetDelivering(true)}
            className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Lịch Sử Mua Hàng
          </button>
          <button
            onClick={() => onGetDelivering(false)}
            className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Hàng Đang Vận Chuyển
          </button>
          <button 
            onClick={onGetProducts} 
            className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Mua Hàng
          </button>
          <button 
            onClick={onShowSignUpForm}
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
  );
}