import { ethers } from 'ethers';
import {createMerkleTree} from './createMrkleTree.service.js';
import {hextoInt} from './utils/hextoInt.js';
import {hexToBigInt} from './utils/hexToBigInt.js'
import {logDataExample} from './utils/logDataExample.js'
export const processBlockData = async (logsBlockData) => {
  try {

    const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);


    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_SAVE_MERKLE_ROOT,
      process.env.CONTRACT_ABI_SAVE_MERKLE_ROOT,
      signer
    );

    const transactionsInfo = logsBlockData.map(topics => ({
      dealId: hextoInt(topics[1]),
      buyerAddress: hexToBigInt(topics[2]),  
    }));
    
    const merkleTree = createMerkleTree(dealId, buyerAddress)
  
    const blockNumber = hextoInt(logsBlockData.blockNumber); 
    const merkleRoot = merkleTree.root;

    await contract.addRoot(blockNumber, merkleRoot);




    const processedData = {
      blockNumber,
      transactionsInfo,
      merkleRoot, 
    };

    return processedData;
  } catch (error) {
    console.error("Error processing block data:", error);
    throw error;
  }
};

processBlockData(logDataExample)
    .then((result) => {
        console.log("Result:", result);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
