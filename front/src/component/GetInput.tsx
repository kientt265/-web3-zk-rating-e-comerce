import React, { useState } from "react";
import GenerateProof from "./GenerateProof";
import { Contract, Signer } from "ethers";

interface GetInputProps {
  dealId: string;
  signer: Signer;
}

const GetInput: React.FC<GetInputProps> = ({ dealId, signer }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
  const [siblingsNode, setSiblingsNode] = useState<string[] | null>(null);
  const [buyerAddressBigInt, setBuyerAddressBigInt] = useState<string | null>(
    null
  );

  const contractAdr =
    import.meta.env.VITE_CONTRACT_ADDRESS_SAVE_MERKLE_ROOT || "";
  const contractABI = JSON.parse(
    import.meta.env.VITE_CONTRACT_ABI_SAVE_MERKLE_ROOT || "[]"
  );

  const fetchAddress = async () => {
    try {
      if (signer) {
        let addressAcc = await signer.getAddress();
        if (addressAcc.startsWith("0x")) {
          addressAcc = addressAcc.slice(2);
        }
        return BigInt(`0x${addressAcc}`).toString();
      }
    } catch (error) {
      console.error("Error fetching buyer address:", error);
      return null;
    }
  };

  const getMerkleRoot = async () => {
    try {
      setLoading(true);
      const data = await fetchSiblingsandBlockNumber(dealId);
      const blockNumberAttr = data.attributes.find(
        (attr: { trait_type: string }) => attr.trait_type === "blockNumber"
      );
      const siblingsNodeAttr = data.attributes.find(
        (attr: { trait_type: string }) => attr.trait_type === "siblingsNode"
      );

      if (!blockNumberAttr || !siblingsNodeAttr) {
        throw new Error("Invalid data from API");
      }

      const blockNumber = blockNumberAttr.value;
      const siblingsNode = siblingsNodeAttr.value;

      const contract = new Contract(contractAdr, contractABI, signer);
      const merkleRoot = await contract.getMerkleRoot(blockNumber);

      const buyerAddressBigInt = await fetchAddress();

      if (merkleRoot && siblingsNode && buyerAddressBigInt) {
        setMerkleRoot(merkleRoot);
        setSiblingsNode(siblingsNode);
        setBuyerAddressBigInt(buyerAddressBigInt);
      }
    } catch (error) {
      console.error("Error fetching Merkle root or related data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiblingsandBlockNumber = async (dealId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/dealId/${dealId}/`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching siblings and block number:", error);
      throw error;
    }
  };

  return (
    <div>
      <button
        onClick={getMerkleRoot}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {merkleRoot && siblingsNode && buyerAddressBigInt && (
        <GenerateProof
          rootMerkle={merkleRoot}
          siblingsNode={siblingsNode}
          key={dealId}
          value1={dealId}
          value2={buyerAddressBigInt}
          signer={signer}
        />
      )}
    </div>
  );
};

export default GetInput;
