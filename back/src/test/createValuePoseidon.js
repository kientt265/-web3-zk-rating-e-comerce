//buildPoseidon
import * as circomlib from 'circomlibjs'; 
export const createValuePoseidon = async (buyerAddress, transactionHash) => {
    try {
        const poseidon = await circomlib.buildPoseidon();
        const poseidonHash = poseidon([buyerAddress, transactionHash]);
        return poseidon.F.toString(poseidonHash);
    } catch (error) {
        console.error("Error processing block data:", error);
        throw error;
    }
}

createValuePoseidon("0x1234567890123456789012345678901234567890", "0x1234567890123456789012345678901234567890");