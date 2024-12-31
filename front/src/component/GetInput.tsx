import React, { useState, useEffect  } from "react";
import GenerateProof from "./GenerateProof";
import { Contract, Signer, ethers, BrowserProvider, JsonRpcSigner } from "ethers";


interface GetInputProps {
  dealId: string;
}

const GetInput: React.FC<GetInputProps> = ({ dealId }) => {
  // const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
  const [siblingsNode, setSiblingsNode] = useState<string[] | null>(null);
  const [buyerAddressBigInt, setBuyerAddressBigInt] = useState<string | null>(
    null
  );
  // useEffect(() => {
  //   async function initProvider() {
  //     try {
  //       if (walletProvider) {
  //         const browserProvider = new BrowserProvider(walletProvider);
  //         const newSigner = await browserProvider.getSigner();
  //         setSigner(newSigner);
  //       } 
  //     } catch (error) {
  //       console.error("Failed to initialize provider:", error);

  //       setSigner(null);
  //     }
  //   }

  //   initProvider();
  // }, [walletProvider]);
  
  const contractAdr =
    import.meta.env.VITE_CONTRACT_ADDRESS_SAVE_MERKLE_ROOT || "";
  const contractABI = JSON.parse(
    import.meta.env.VITE_CONTRACT_ABI_SAVE_MERKLE_ROOT || "[]"
  );
  const providerURL = import.meta.env.VITE_SEPOLIA_RPC_URL || "";
  const provider = new ethers.JsonRpcProvider(providerURL); 
  // const fetchAddress = async () => {
  //   try {
  //     if (signer) {
  //       let addressAcc = await signer.getAddress();
  //       if (addressAcc.startsWith("0x")) {
  //         addressAcc = addressAcc.slice(2);
  //       }
  //       return BigInt(`0x${addressAcc}`).toString();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching buyer address:", error);
  //     return null;
  //   }
  // };

  const getMerkleRoot1 = async () => {
    try {
      setLoading(true);
      const data = await fetchSiblingsandBlockNumber(dealId);
  

      const blockNumberAttr = data.blockNumber
      const siblingsNodeAttr: string[] = data.proofMerkle; 
      const buyerAddressBigIntAttr = data.buyerAddress
      // console.log("blockNumberAttr", typeof blockNumberAttr);
      // console.log("siblingsNodeAttr", siblingsNodeAttr);
      // console.log("buyerAddressBigIntAttr",typeof buyerAddressBigIntAttr);
      if (!blockNumberAttr || !siblingsNodeAttr) {
        throw new Error("Missing blockNumber or siblingsNode attribute");
      }
  


      const contract = new Contract(contractAdr, contractABI, provider);
      // console.log("Contract:", contract);
      const merkleRoot2 = await contract.getRootByBlockNuber(blockNumberAttr);

      // console.log("Merkle root:", merkleRoot2);
      // const buyerAddressBigInt = await fetchAddress();

      
        setMerkleRoot(merkleRoot2);
        setSiblingsNode(siblingsNodeAttr);
        setBuyerAddressBigInt(buyerAddressBigIntAttr);
      
    } catch (error) {
      console.error("Error fetching Merkle root or related data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchSiblingsandBlockNumber = async (dealId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/request/${dealId}/`
      );
      const data = await response.json();
      console.log("Data from API:", data);
      return data;
    } catch (error) {
      console.error("Error fetching siblings and block number:", error);
      throw error;
    }
  };

  return (
    <div>
      <button
        onClick={getMerkleRoot1}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      <h1>MerkleRoot{merkleRoot}</h1>
      <h1>Siblings{siblingsNode}</h1>
      <h1>BuyerAddress{buyerAddressBigInt}</h1>
      {merkleRoot && siblingsNode && buyerAddressBigInt && (
        <GenerateProof
          rootMerkle={merkleRoot}
          siblingsNode={siblingsNode}
          key1={dealId}
          value1={dealId}
          value2={buyerAddressBigInt}
        />
      )}
    </div>
  );
};

export default GetInput;
