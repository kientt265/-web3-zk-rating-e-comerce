import { defaultConfig } from "@web3modal/ethers/react";

const projectId = import.meta.env.VITE_PROJECT_ID;

export const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
};

export const besu = {
  chainId: 1337,
  name: "Besu-network",
  currency: "ETH",
  explorerUrl: "",
  rpcUrl: import.meta.env.VITE_BESU_RPC_URL,
};

const metadata = {
  name: "Crowfunding",
  description: "Website help people donation for me",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

export const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});