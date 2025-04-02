import { FC } from 'react';
import { shortenAddress } from '../lib/utils';

interface HeaderProps {
  address?: string;
  isConnected: boolean;
  onOpenWallet: () => void;
  onShowSignUp: () => void;
  onGetProducts: () => void;
  onGetDelivering: (completed: boolean) => void;
  activeView: 'products' | 'deals';
  setActiveView: (view: 'products' | 'deals') => void;
}

const Header: FC<HeaderProps> = ({
  address,
  isConnected,
  onOpenWallet,
  onShowSignUp,
  onGetProducts,
  onGetDelivering,
  activeView,
  setActiveView
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              VerifComerce
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
              <a 
                href="https://sepolia.etherscan.io/address/0x83abF096267849fcDDb7fcAb2DDfbbD636d8eAe8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                MerkleRoot
              </a>
              <a 
                href="https://sepolia.etherscan.io/address/0xaacd754db17e0d46fde1f424b27c56d530c85870" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Nullifier
              </a>
              <a 
                href="https://sepolia.etherscan.io/address/0x204369e4c844de8d5299baa86d62fa76174cd670" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Rating
              </a>
              <a 
                href="https://sepolia.etherscan.io/address/0x5a94ecbd4a4cbcd7e1cab4b4ec86d7d8660915f1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                ContractVerifyZK
              </a>
            </div>

            {/* <div className="flex items-center gap-3">
              <button
                onClick={() => onGetDelivering(true)}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Lịch Sử Mua Hàng
              </button>
              <button
                onClick={() => onGetDelivering(false)}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Hàng Đang Vận Chuyển
              </button>
              <button 
                onClick={onGetProducts} 
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Mua Hàng
              </button>
            </div> */}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveView('products')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'products'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sản phẩm
              </button>
              <button
                onClick={() => setActiveView('deals')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === 'deals'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Đơn hàng của tôi
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onShowSignUp}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
              <button 
                onClick={onOpenWallet}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {shortenAddress(address)}
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;