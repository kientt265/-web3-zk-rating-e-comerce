
import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther} from 'ethers'
import { useEffect, useState } from "react";
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {InteractPrivateChain} from './component/InteractPrivateChain'
import History from './component/History'
const projectId = import.meta.env.VITE_PROJECT_ID;

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
  const { address, isConnected } = useWeb3ModalAccount()
  const {walletProvider} = useWeb3ModalProvider()
  const { open } = useWeb3Modal()

  const contractABI = import.meta.env.VITE_ABI_CONTRACT_PRIVATE_COMERCE
  const contractAdr = import.meta.env.VITE_CONTRACT_ADDRESS_PRIVATE_COMERCE



  return (
    <div>
    <header className="mx-auto px-2 p-4 border-b">
      <div className="flex items-center justify-between"> {/* Sử dụng justify-between để căn trái phải */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">VerifComerce</h1>
        </div>
        <div className="flex gap-4"> {/* Tạo một container flex cho các nút */}
        <button className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
            Lịch Sử Mua Hàng
          </button>
          <button className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
            Đang Giao Hàng
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
    <div>
      {/* <InteractPrivateChain/> */}
      <History />
    </div>
  </div>
  
  )
}

export default App
