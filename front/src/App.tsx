
import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther} from 'ethers'
import { useEffect, useState } from "react";
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {InteractPrivateChain} from './component/InteractPrivateChain'
import History from './component/History'
import useEthers from "./hooks/useEthers"
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
  const { provider } = useEthers();
  const {signer} = useEthers()
  const {walletProvider} = useWeb3ModalProvider()
  const { open } = useWeb3Modal()
  const [isSuccess, setIsSuccess] = useState(false); // State lưu trạng thái thành công
  const [isLoading, setIsLoading] = useState(false);

  // const contractABI = [
  //   'function setNumber(uint256)',
  //   'function getNumber() view returns(uint256)'
  // ]
  // const contractAdr = "0x2e3d7efD0A31f2200b79e78E97dF0C8999EdD654"
  const contractABI = [
    'function createDeal(string memory _productId, uint _amount) payable',
'function completeDeal(uint _dealId)',
'function getDealId(address _addressUser) view returns(uint)',
'event DealCreated(uint dealId, address buyer, string productId, uint amount, uint value)',
'event DealConfirmed(uint dealId)',
'event DealCompleted(uint dealId, uint amount, address buyer)',
'function createSeller(string memory _shopName, string memory _email)',
'function uploadItems(string memory _productID, uint _quantityPerItem, uint _pricePerProduct)',
'function getDetailProduct(string memory _productID) view returns(uint, uint)',
'function SignUp(string memory _name, uint8 _age, string memory _email)',
'event NewUser(address _address)'
  ]
  const contractAdr = import.meta.env.VITE_CONTRACT_ADDRESS_PRIVATE_COMERCE
  const handleProvider = async () => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        // Lấy thông tin về mạng mà provider đang kết nối
        console.log(signerProvider);
        const network = await browserProvider.getNetwork();
        const chainId = network.chainId;
        const networkName = network.name;
        const contract = new Contract(contractAdr, contractABI, await signerProvider);
        console.log(contract)
        const numberToSet = 42;

        // const transaction = await contract.setNumber(numberToSet);
        const transaction = await contract.createSeller("Shop ABC", "shop@example.com");
        await transaction.wait();

        // Thông báo thành công
        setIsSuccess(true);
  
      } catch (error) {
        console.error("Error creating seller:", error);
        alert("Error creating seller, please try again!");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No BrowserProvider connected.");
    }

  }

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
      {/* <History /> */}
      {/* Your code in here */}
      <button
          onClick={handleProvider}
          disabled={isLoading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          {isLoading ? "Processing..." : "Create Seller"}
        </button>

        {isSuccess && !isLoading && <p className="text-green-500 mt-2">Seller created successfully!</p>}
        
    </div>
  </div>
  
  )
}

export default App
