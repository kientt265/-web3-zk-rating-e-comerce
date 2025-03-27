
import { ethers } from 'ethers';

    export const  saveNullfier = async(nullifier) => {
        const nullifier = nullifier;
        const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
        const contractRating = new ethers.Contract(process.env.CONTRACT_ADDRESS_SAVE_NULLIFIER, process.env.ABI_CONTRACT_SAVE_NULLIFIER, signer)
        const saveNullifier = await contractRating.addNullifier(nullifier);
        await saveNullifier.wait() 
    }