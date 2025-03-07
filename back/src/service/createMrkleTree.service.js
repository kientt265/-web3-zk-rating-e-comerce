import * as circomlib from 'circomlibjs'; 
import { randomBytes } from 'crypto';

export const createMerkleTree = async (dealId, buyerAddress) => {

    const poseidon = await circomlib.buildPoseidon();


    function getRandomValue() {
        return BigInt('0x' + randomBytes(16).toString('hex')).toString();
    }


    async function createValue() {
        const hashArray = poseidon([dealId.toString(), buyerAddress]);
        return poseidon.F.toString(hashArray);
    }

    async function createNullifier() {
        const nullifier = poseidon([dealId.toString(), buyerAddress, 1]);
        return poseidon.F.toString(nullifier);
    }

    async function getMerkleProof(smt, key) {
        const F = smt.F;
        const keyScalar = F.e(key);


        const resFind = await smt.find(keyScalar);

        if (!resFind.found) {
            throw new Error("Key not found in the Merkle tree");
        }

        const path = resFind.siblings.map((sibling) => poseidon.F.toString(sibling));
        while (path.length < 21) {
            path.push("0");
        }


        return {
            key: key,
            value: poseidon.F.toString(resFind.foundValue),
            path: path,
        };
    }

    const smt = await circomlib.newMemEmptyTrie();
    const value = await createValue();
    const key = dealId.toString();

    await smt.insert(dealId, value);

    for (let i = dealId + 1; i <= dealId + 99; i++) {
        const randomValue = getRandomValue();
        await smt.insert(i.toString(), randomValue.toString());
    }

    // console.log("Root Hash:", poseidon.F.toString(smt.root));

    const nullifier = await createNullifier();
    const proofKey = await getMerkleProof(smt, key);
    // console.log("Merkle Proof for the key:", proofKey);


    return {
        root: poseidon.F.toString(smt.root),
        proof: proofKey,
        nullifier: nullifier
    };
}


