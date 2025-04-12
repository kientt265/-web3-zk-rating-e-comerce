import * as circomlib from 'circomlibjs';
import { randomBytes } from 'crypto';

async function createMerkleTree(treeDepth, numNodesToInsert) {
    console.time(`Create Merkle Tree (Depth ${treeDepth}, Nodes ${numNodesToInsert})`);
    const poseidon = await circomlib.buildPoseidon();
    const smt = await circomlib.newMemEmptyTrie();

    function getRandomValue() {
        return BigInt('0x' + randomBytes(16).toString('hex')).toString();
    }

    async function insertNodes(tree, numNodes) {
        console.log(`Inserting ${numNodes} nodes...`);
        const batchSize = 1000;
        const batches = Math.ceil(numNodes / batchSize);
        
        async function insertBatch(startIdx) {
            const endIdx = Math.min(startIdx + batchSize, numNodes);
            const promises = [];
            
            for (let i = startIdx; i < endIdx; i++) {
                promises.push(tree.insert(i.toString(), getRandomValue()));
            }
            
            await Promise.all(promises);
            console.log(`Progress: Batch ${Math.floor(startIdx/batchSize) + 1}/${batches} completed`);
        }

        const batchPromises = [];
        for (let i = 0; i < numNodes; i += batchSize) {
            batchPromises.push(insertBatch(i));
        }
        
        await Promise.all(batchPromises);
    }

    await insertNodes(smt, numNodesToInsert);

    console.timeEnd(`Create Merkle Tree (Depth ${treeDepth}, Nodes ${numNodesToInsert})`);
    return { smt, poseidon };
}

async function queryMerkleTree(smt, poseidon, key, treeDepth) {
    console.time(`Query Merkle Tree for key ${key} (Depth ${treeDepth})`);
    const resFind = await smt.find(key.toString());
    
    if (!resFind.found) {
        throw new Error("Key not found in the Merkle tree");
    }

    const proof = {
        siblings: resFind.siblings,
        value: resFind.foundValue,
        key: key
    };

    console.log(`Found ${proof.siblings.length} sibling nodes for key ${key}`);
    console.timeEnd(`Query Merkle Tree for key ${key} (Depth ${treeDepth})`);
    return proof;
}

async function verifyProof(smt, poseidon, key, proof, treeDepth) {
    console.time(`Verify Proof for key ${key} (Depth ${treeDepth})`);
    
    const F = smt.F;
    const keyBits = smt._splitBits(key);
    
    // Start with leaf hash
    let currentHash = smt.hash1(F.e(key), proof.value);
    
    // Traverse up the tree using siblings
    for (let i = proof.siblings.length - 1; i >= 0; i--) {
        const sibling = proof.siblings[i];
        if (keyBits[i]) {
            currentHash = smt.hash0(sibling, currentHash);
        } else {
            currentHash = smt.hash0(currentHash, sibling);
        }
    }
    
    // Compare with root
    const isValid = F.eq(currentHash, smt.root);
    console.log(`Proof verification result: ${isValid}`);
    console.timeEnd(`Verify Proof for key ${key} (Depth ${treeDepth})`);
    return isValid;
}

// (async () => {
//     try {
//         console.log("Starting Merkle Tree creation with depth 20 (3500 nodes)...");
//         const depth20 = await createMerkleTree(20, 3500);
        
//         // Create a fixed test value
//         const testKey = "1000";
//         const testValue = "12345";
//         await depth20.smt.insert(testKey, testValue);
        
//         // Query for siblings
//         console.log("\nQuerying sibling nodes for leaf 1000...");
//         const proof = await queryMerkleTree(depth20.smt, depth20.poseidon, testKey, 20);
        
//         // Verify the proof
//         console.log("\nVerifying proof...");
//         await verifyProof(depth20.smt, depth20.poseidon, testKey, proof, 20);
        
//     } catch (error) {
//         console.error("Error:", error);
//     }
// })();

(async () => {
    try {
        console.log("Starting Merkle Tree creation with depth 60 (1000 nodes)...");
        const depth60 = await createMerkleTree(60, 50000);
        
        // Create a fixed test value
        const testKey = "1000";
        const testValue = "12345";
        await depth60.smt.insert(testKey, testValue);
        
        // Query for siblings
        console.log("\nQuerying sibling nodes for leaf 1000...");
        const proof = await queryMerkleTree(depth60.smt, depth60.poseidon, testKey, 60);
        
        // Verify the proof
        console.log("\nVerifying proof...");
        await verifyProof(depth60.smt, depth60.poseidon, testKey, proof, 60);
        
    } catch (error) {
        console.error("Error:", error);
    }
})();