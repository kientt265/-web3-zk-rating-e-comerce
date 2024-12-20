import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcProvider,  } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { JsonRpcSigner } from "ethers";

interface UseEthersReturn {
  provider:  JsonRpcProvider | null;
  signer: JsonRpcSigner | null;
}

function useEthers(): UseEthersReturn {
  const { walletProvider } = useWeb3ModalProvider();
  const [provider, setProvider] = useState<
     JsonRpcProvider | null
  >(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    async function initProvider() {
      try {
        const besuProvider = new JsonRpcProvider("http://127.0.0.1:8545")
        setProvider(besuProvider)
        // if (walletProvider) {
        //   // Nếu ví đã được kết nối qua Web3Modal
        //   const browserProvider = new BrowserProvider(walletProvider);
        //   setProvider(browserProvider);

        //   const newSigner = await browserProvider.getSigner();
        //   setSigner(newSigner);
        // } else {
        //   // Nếu không có ví, sử dụng Moralis làm fallback provider
        //   const moralisRpcUrl = import.meta.env.VITE_BESU_RPC_URL;
        //   if (!moralisRpcUrl) {
        //     throw new Error("Moralis RPC URL is not set");
        //   }

        //   const defaultProvider = new JsonRpcProvider(("http://localhost:8545"));
        //   setProvider(defaultProvider);
        //   setSigner(null); // Không có ví kết nối, nên signer là null
        // }
      } catch (error) {
        console.error("Failed to initialize provider:", error);
        setProvider(null);
        setSigner(null);
      }
    }

    initProvider();
  }, [walletProvider]);

  return { provider, signer };
}

export default useEthers;
