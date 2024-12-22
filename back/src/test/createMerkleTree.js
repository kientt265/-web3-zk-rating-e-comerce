import * as circomlib from 'circomlibjs';  // Correct import for circomlibjs
import { dataExample } from './dataExample.js';

export const createMerkleTree = async (blockData) => {
  try {
    if (!blockData.transactions || !Array.isArray(blockData.transactions)) {
      throw new Error("Invalid block data: transactions not found or not an array");
    }

    const transactionsInfo = blockData.transactions.map(transaction => ({
      buyerAddress: transaction.from,
      transactionHash: transaction.hash,
    }));

    // Tạo một hàm băm Poseidon
    const poseidon = await circomlib.buildPoseidon();

    const leafHashes = await Promise.all(
      transactionsInfo.map(async ({ buyerAddress, transactionHash }) => {
        const poseidonHash = poseidon([buyerAddress, transactionHash]);  // Sử dụng circomlib.poseidon
        return poseidon.F.toString(poseidonHash);
      })
    );

    console.log("Leaf Hashes:", leafHashes); // Log to verify leaf hashes

    const merkleTree = buildMerkleTree(leafHashes, poseidon);
    const merkleTreeLevel = calculateTreeLevel(leafHashes.length);
    const merkleRoot = merkleTree.root;
    console.log("Merkle Root:", merkleRoot); // Log merkle root

    const merkleRootString = merkleRoot.map(value => value.toString()).join('');
    console.log("Merkle Root (String):", merkleRootString); // Log merkle root dưới dạng decimal
    const merkleRootHex = Array.from(merkleRoot).map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log("Merkle Root (Hex):", merkleRootHex); // Log merkle root dưới dạng hex

    const blockNumber = parseInt(blockData.number, 16);
    const processedData = {
      blockNumber,
      timestamp: new Date(parseInt(blockData.timestamp, 16) * 1000),
      transactionsInfo,
      merkleRoot,
      proofs: transactionsInfo.map(({ buyerAddress }, index) => ({
        buyerAddress,
        proof: merkleTree.getProof(index),
      })),
      treeLevel: merkleTreeLevel,
    };

    return processedData;
  } catch (error) {
    console.error("Error processing block data:", error);
    throw error;
  }
};

const buildMerkleTree = (leaves, poseidon) => {
  const tree = new MerkleTree(leaves, poseidon);
  return tree;
};

const calculateTreeLevel = (numberOfLeaves) => {
  const level = Math.ceil(Math.log2(numberOfLeaves));
  return level;
};

class MerkleTree {
  constructor(leaves, poseidon) {
    this.leaves = leaves;
    this.levels = [leaves];
    this.poseidon = poseidon;
    this.buildTree();
  }

  buildTree() {
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const pair = currentLevel[i + 1] ? [currentLevel[i], currentLevel[i + 1]] : [currentLevel[i], currentLevel[i]];
        nextLevel.push(this.poseidon(pair));
      }
      this.levels.push(nextLevel);
      currentLevel = nextLevel;
    }
  }

  get root() {
    return this.levels[this.levels.length - 1][0];
  }

  getProof(index) {
    let proof = [];
    let currentIndex = index;

    for (let i = 0; i < this.levels.length - 1; i++) {
      const currentLevel = this.levels[i];
      const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
      proof.push(currentLevel[siblingIndex]);
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }
}

// Sử dụng blockDetails.transactions thay vì blockData.transactions
createMerkleTree(dataExample.blockDetails);
