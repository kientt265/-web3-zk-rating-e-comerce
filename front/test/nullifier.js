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

const a = "2BEF6298f46817f7391A852dfc6669492Ea72d90";
const b = "1abc";
const c = "72";

PoseidonThreePara(a, b, c);