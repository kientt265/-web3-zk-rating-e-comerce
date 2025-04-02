import * as circomlibjs from 'circomlibjs';

const PoseidonThreePara = async (privateKey, productId, dealId) => {
    try {
        const poseidon = await circomlibjs.buildPoseidon();

        // Convert hex inputs (without 0x prefix) to BigInt
        const privateKeyBigInt = BigInt('0x' + privateKey);
        console.log(privateKeyBigInt);
        const productIdBigInt = BigInt('0x' + productId);
        console.log(productIdBigInt);
        // Convert decimal dealId to BigInt directly
        const dealIdBigInt = BigInt(dealId);
        console.log(dealIdBigInt);

        const hash = poseidon([privateKeyBigInt, productIdBigInt, dealIdBigInt]);
        const hashBigInt = poseidon.F.toObject(hash);
        console.log(hashBigInt.toString());
        return hashBigInt.toString();
    } catch (error) {
        console.error('Error in PoseidonThreePara:', error);
        throw error;
    }
}

const a = "8d736906ec7a1cae1ac025eb320f06effc63cee13fa4c07fc5341b9b21bdc032";
const b = "1abc";
const c = "74";

PoseidonThreePara(a, b, c);
