
import { ethers } from 'ethers';

export const saveNullfier = async(nullifierInput) => {
    try {
        const nullifier = nullifierInput;
        const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
        const contractRating = new ethers.Contract(
            process.env.CONTRACT_ADDRESS_SAVE_NULLIFIER, 
            process.env.ABI_CONTRACT_SAVE_NULLIFIER, 
            signer
        );
        
        const saveNullifier = await contractRating.addNullifier(nullifier);
        const receipt = await saveNullifier.wait();
        
        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        throw new Error(`Failed to save nullifier: ${error.message}`);
    }
}