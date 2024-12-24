import * as circomlib from 'circomlibjs'; 
import { randomBytes } from 'crypto';
import { Scalar } from "ffjavascript";
// export {SMT, buildSMT, newMemEmptyTrie} from "./src/smt.js";
// export { buildPoseidon, buildPoseidonWasm } from "./src/poseidon_wasm.js";

async function createMerkleTree() {
    const smt = await circomlib.newMemEmptyTrie();
    await smt.insert(17n, 11529061684692552657230961141596421765567280749351910908429396349823862793927);
    await smt.insert(15n, 159684336652054988991215779568000532806);
    await smt.insert(16n, 242108076058607163538102198631955675649);
    await smt.insert(14n, 102349190794087733531672488128345440122);

    console.log(smt.root);
    //console.log(smt.db);
    const proof = await getMerkleProof(smt, 17n);
    console.log("Merkle Proof for the key:", proof);
}
async function getMerkleProof(smt, key) {
        const F = smt.F;
        const keyScalar = F.e(key);

    // Find the key in the tree
    const resFind = await smt.find(keyScalar);

    if (!resFind.found) {
        throw new Error("Key not found in the Merkle tree");
    }

    // The Merkle proof will include all siblings along the path from the key to the root
    const proof = {
        key: key,
        value: resFind.foundValue,
        path: resFind.siblings, // These are the sibling nodes to verify the key's existence
    };

    return proof;
}
createMerkleTree();