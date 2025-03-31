
import * as circomlibjs from 'circomlibjs';

const PoseidonThreePara = async (privateKey: string, productId: string, dealId: string) => {
    try {
        // Initialize Poseidon
        const poseidon = await circomlibjs.buildPoseidon();

        // Convert inputs to BigInt
        const privateKeyBigInt = BigInt(privateKey);
        const productIdBigInt = BigInt(productId);
        const dealIdBigInt = BigInt(dealId);

        // Create hash using poseidon
        const hash = poseidon([privateKeyBigInt, productIdBigInt, dealIdBigInt]);
        
        // Convert hash to string
        const hashStr = poseidon.F.toString(hash);
        
        console.log('Input values:', {
            privateKey: privateKeyBigInt.toString(),
            productId: productIdBigInt.toString(),
            dealId: dealIdBigInt.toString()
        });
        console.log('Hash result:', hashStr);

        return hashStr;
    } catch (error) {
        console.error('Error in PoseidonThreePara:', error);
        throw error;
    }
}

export default PoseidonThreePara