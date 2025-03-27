import * as circomlib from 'circomlibjs';

export const createMerkleTree = async () => {
    console.time("createMerkleTree");
    const poseidon = await circomlib.buildPoseidon();

    const keys = [0, 1, 2, 3, 4, 5, 6, 7];
    const values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // Convert string values to numeric representation (ASCII code)
    const leaves = keys.map((key, index) => poseidon([key.toString(), values[index].charCodeAt(0)]));

    // Create Merkle tree with height limit of 3
    const smt = await circomlib.newMemEmptyTrie({ height: 3 });
    for (let i = 0; i < keys.length; i++) {
        await smt.insert(keys[i].toString(), poseidon.F.toString(leaves[i]));
    }

    // Check if specific keys are in the tree before inserting new nodes
    console.log("Checking keys before inserting new nodes:");
    const checkKeysBefore = [0, 1, 2];
    for (const key of checkKeysBefore) {
        const found = await smt.find(key.toString());
        console.log(`Key ${key} is ${found.found ? 'present' : 'not present'} in the tree.`);
    }

    // Insert additional keys 8, 9, 10
    const additionalKeys = [8, 9, 10];
    const additionalValues = ['i', 'j', 'k'];
    for (let i = 0; i < additionalKeys.length; i++) {
        const leaf = poseidon([additionalKeys[i].toString(), additionalValues[i].charCodeAt(0)]);
        await smt.insert(additionalKeys[i].toString(), poseidon.F.toString(leaf));
    }

    // Log the root to ensure the tree is constructed
    console.log('Merkle Tree Root:', poseidon.F.toString(smt.root));

    // Check if all keys from 0 to 10 are in the tree after inserting new nodes
    console.log("Checking all keys from 0 to 10 after inserting new nodes:");
    for (let key = 0; key <= 10; key++) {
        const found = await smt.find(key.toString());
        console.log(`Key ${key} is ${found.found ? 'present' : 'not present'} in the tree.`);
    }

    // List nodes in the tree
    const nodes = [];
    for (let i = 0; i < Math.min(smt.levels, 3); i++) { // Limit to 3 levels
        const levelNodes = smt.getNodesAtLevel(i).map(node => poseidon.F.toString(node));
        console.log(`Nodes at level ${i}:`, levelNodes); // Log nodes at each level
        nodes.push(levelNodes);
    }

    console.timeEnd("createMerkleTree");
    console.log('Merkle Tree Nodes:', nodes);
    return nodes;
}

// Execute the function
createMerkleTree();