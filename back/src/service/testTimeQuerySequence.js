import * as circomlib from 'circomlibjs'; 
import { randomBytes } from 'crypto';

async function createMerkleTree(treeDepth) {
    console.time(`Create Merkle Tree (Depth ${treeDepth})`);
    const poseidon = await circomlib.buildPoseidon();
    const smt = await circomlib.newMemEmptyTrie();

    function getRandomValue() {
        return BigInt('0x' + randomBytes(16).toString('hex')).toString();
    }

    async function insertNodes(tree, numNodes) {
        console.log(`Inserting ${numNodes} nodes...`);
        for (let i = 0; i < numNodes; i++) {
            if (i % 1000 === 0) {
                console.log(`Progress: ${i}/${numNodes} nodes inserted`);
            }
            await tree.insert(i.toString(), getRandomValue());
        }
    }

    const numLeaves = 2 ** treeDepth;
    await insertNodes(smt, numLeaves);

    console.timeEnd(`Create Merkle Tree (Depth ${treeDepth})`);
    return { smt, poseidon };
}

async function queryMerkleTree(smt, poseidon, key, treeDepth) {
    console.time(`Query Merkle Tree for key ${key} (Depth ${treeDepth})`);
    const resFind = await smt.find(key.toString());
    
    if (!resFind.found) {
        throw new Error("Key not found in the Merkle tree");
    }

    const proof = resFind.siblings.map((sibling) => poseidon.F.toString(sibling));
    console.log(`Found ${proof.length} sibling nodes for key ${key}`);
    console.log('Sibling nodes:', proof);
    
    console.timeEnd(`Query Merkle Tree for key ${key} (Depth ${treeDepth})`);
    return proof;
}

(async () => {
    try {
        console.log("Starting Merkle Tree creation with depth 18...");
        const depth18 = await createMerkleTree(18);
        
        // Query for a leaf node (let's try with node 1000)
        console.log("\nQuerying sibling nodes for leaf 1000...");
        await queryMerkleTree(depth18.smt, depth18.poseidon, "1000", 18);
        
    } catch (error) {
        console.error("Error:", error);
    }
})();
