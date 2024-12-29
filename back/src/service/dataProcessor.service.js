import { ethers } from 'ethers';
import {createMerkleTree} from './createMrkleTree.service.js';
import {hextoInt} from './utils/hextoInt.js';
import {hexToBigInt} from './utils/hexToBigInt.js'
import {logDataExample} from './utils/logDataExample.js'
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
    const transactionsInfo = logsBlockData.map(log => ({
      dealId: hextoInt(log.topics[1]),       
      buyerAddress: hexToBigInt(log.topics[2]),
    }));
    
    console.log("Transactions info:", transactionsInfo);
    // const merkleTree = createMerkleTree(dealId, buyerAddress)
    const blockNumber = hextoInt(logsBlockData[0].blockNumber); 
    console.log("Block number:", blockNumber);
    


    const dealIds = transactionsInfo.map(tx => tx.dealId); 
    const buyerAddresses = transactionsInfo.map(tx => tx.buyerAddress.toString()); 
    console.log("Deal IDs:", dealIds);
    console.log("Buyer addresses:", buyerAddresses);
    const merkleTree = await createMerkleTree(dealIds, buyerAddresses);
    

    

    const merkleRoot = merkleTree.root;

    const transaction = await contract.addRoot(blockNumber, merkleRoot);
    await transaction.wait();

    console.log("Merkle root:", typeof merkleRoot, merkleRoot);
    console.log("Merkle Proof:", merkleTree.proof);

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
        
    })
    .catch((error) => {
        console.error("Error:", error);
    });
