import React, { useState, useEffect  } from "react";
import GenerateProof from "./GenerateProof";
import { Contract, Signer, ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import * as circomlib from 'circomlibjs'; 

interface GetInputProps {
  dealId: string;
  productId: string;
  rating: string;
  address: string;
  msgHash: string;
  r: string;
  s: string;
  v: number;
  comment: string;
  images: File[];
}

const GetInput: React.FC<GetInputProps> = ({ dealId, productId, rating, address, msgHash, r, s, v,  comment, images }) => {
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
  const  hexToBigInt = (hexAddress: string) => {

    if (hexAddress.startsWith("0x")) {
      hexAddress = hexAddress.slice(2);
    }
  
    return BigInt(`0x${hexAddress}`);
  };
  const getMerkleRoot1 = async () => {
    console.time("getMerkleRoot1"); // Bắt đầu đo thời gian cho hàm getMerkleRoot1
    try {
      setLoading(true);
  
      console.time("fetchSiblingsandBlockNumber"); // Bắt đầu đo thời gian fetchSiblingsandBlockNumber
      const data = await fetchSiblingsandBlockNumber(dealId);
      console.timeEnd("fetchSiblingsandBlockNumber"); // Kết thúc đo thời gian fetchSiblingsandBlockNumber
  
      const blockNumberAttr = data.blockNumber;
      const siblingsNodeAttr: string[] = data.proofMerkle;
      const value2BigInt = hexToBigInt(address);
      const realValue2 = value2BigInt.toString();
  
      if (!blockNumberAttr || !siblingsNodeAttr) {
        throw new Error("Missing blockNumber or siblingsNode attribute");
      }
  
      console.time("contract.getRootByBlockNuber"); // Bắt đầu đo thời gian getRootByBlockNuber
      const contract = new Contract(contractAdr, contractABI, provider);
      const merkleRoot2 = await contract.getRootByBlockNuber(blockNumberAttr);
      console.timeEnd("contract.getRootByBlockNuber"); // Kết thúc đo thời gian getRootByBlockNuber
  
      setMerkleRoot(merkleRoot2);
      setSiblingsNode(siblingsNodeAttr);
      setBuyerAddressBigInt(realValue2);
    } catch (error) {
      console.error("Error fetching Merkle root or related data:", error);
    } finally {
      setLoading(false);
      console.timeEnd("getMerkleRoot1"); // Kết thúc đo thời gian getMerkleRoot1
    }
  };
  
  const fetchSiblingsandBlockNumber = async (dealId: string) => {
    console.time("fetchSiblingsandBlockNumber function"); // Bắt đầu đo thời gian cho hàm fetchSiblingsandBlockNumber
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
    } finally {
      console.timeEnd("fetchSiblingsandBlockNumber function"); // Kết thúc đo thời gian fetchSiblingsandBlockNumber
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
          msgHash={msgHash}
          r={r}
          s={s}
          v={v.toString()}
          key1={dealId}
          value1={dealId}
          value2={buyerAddressBigInt}
          productId={productId}
          rating = {rating}
          comment = {comment}
          images ={images}
          // password= {password}
        />
      )}
    </div>
  );
};

export default GetInput;
