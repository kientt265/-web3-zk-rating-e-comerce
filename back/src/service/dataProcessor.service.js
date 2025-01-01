import { ethers } from 'ethers';
import {createMerkleTree} from './createMrkleTree.service.js';
import {hextoInt} from './utils/hextoInt.js';
import {hexToBigInt} from './utils/hexToBigInt.js'
import {logDataExample} from './utils/logDataExample.js'
import Data from '../database/schema/dataModel.js'
import dotenv from 'dotenv';
dotenv.config();

export const processBlockData = async (logsBlockData) => {
  try {

    const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);


    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_SAVE_MERKLE_ROOT,
      process.env.CONTRACT_ABI_SAVE_MERKLE_ROOT,
      signer
    );
    console.log("Contract:", contract);
    console.log("Logs block data:", logsBlockData)
    const transactionsInfo = {
      dealId: hextoInt(logsBlockData.topics[1]),       
      buyerAddress: hexToBigInt(logsBlockData.topics[2]),
    };
    
    console.log("Transactions info:", transactionsInfo);
    // const merkleTree = createMerkleTree(dealId, buyerAddress)
    const blockNumber = hextoInt(logsBlockData.blockNumber); 
    console.log("Block number:", blockNumber);
    // roi test lai di 


    const dealIds = transactionsInfo.dealId; 
    const buyerAddresses = transactionsInfo.buyerAddress.toString(); 
    console.log("Deal IDs:", dealIds);
    console.log("Buyer addresses:", buyerAddresses);
    const merkleTree = await createMerkleTree(dealIds, buyerAddresses);
    

    

    const merkleRoot = merkleTree.root;
    
    const transaction = await contract.addRoot(blockNumber, merkleRoot);
    await transaction.wait();

    console.log("Merkle root:", typeof merkleRoot, merkleRoot);
    console.log("Merkle Proof:", merkleTree.proof);


    const processedData = {
      blockNumber: blockNumber,
      dealID: dealIds.toString(),
      proofMerkle: merkleTree.proof.path,
      buyerAddress: buyerAddresses 
    }; // lai di lan nay ok

    const dealData = new Data(processedData);
    await dealData.save();

    return dealData;
  } catch (error) {
    console.error("Error processing block data:", error);
    throw error;
  }
};

// processBlockData(logDataExample)
//     .then((result) => {
        
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });
