import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const contractAddressRating = import.meta.env.VITE_CONTRACT_ADDRESS_RATING || "0x5Aa3addfE30144F11Ec5408fcF56baC906a97964";
const contractABIRating = JSON.parse(import.meta.env.VITE_CONTRACT_ABI_RATING || "[]");

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
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

export const initWeb3Modal = () => {
  createWeb3Modal({
    ethersConfig,
    chains: [sepolia, besu],
    projectId,
    enableAnalytics: true,
  });
};

export { contractAddressRating, contractABIRating };