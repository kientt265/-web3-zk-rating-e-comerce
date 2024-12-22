import * as poseidon from 'circomlibjs';
import { ethers } from 'ethers';

export const processBlockData = async (blockData) => {
  try {
    // Khởi tạo provider từ URL_RPC_INFURA
    const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

    // Khởi tạo contract để gửi MerkleRoot
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_SAVE_MERKLE_ROOT,
      process.env.CONTRACT_ABI_SAVE_MERKLE_ROOT,
      signer
    );

    // Khởi tạo mảng chứa thông tin giao dịch
    const transactionsInfo = blockData.transactions.map(transaction => ({
      buyerAddress: transaction.from,
      transactionHash: transaction.hash,
    }));

    // Tạo Poseidon hash cho mỗi cặp buyerAddress và transactionHash
    const leafHashes = await Promise.all(
      transactionsInfo.map(async ({ buyerAddress, transactionHash }) => {
        const poseidonHash = await poseidon.poseidon([buyerAddress, transactionHash]);
        return poseidonHash;
      })
    );

    // Xây dựng cây Merkle từ các leafHashes
    const merkleTree = buildMerkleTree(leafHashes);

    // Sau khi tính toán MerkleRoot, gửi lên Sepolia
    const blockNumber = parseInt(blockData.number, 16); // Chuyển từ hex sang số
    const merkleRoot = merkleTree.root;

    // Gửi MerkleRoot lên contract
    await contract.addRoot(blockNumber, merkleRoot);

    // Tính cấp của cây Merkle
    const merkleTreeLevel = calculateTreeLevel(leafHashes.length);

    // Trả về thông tin đã xử lý, bao gồm MerkleRoot, bằng chứng và cấp của cây
    const processedData = {
      blockNumber,
      timestamp: new Date(parseInt(blockData.timestamp, 16) * 1000), // Chuyển hex timestamp sang Date
      transactionsInfo,
      merkleRoot, // Root của cây Merkle
      proofs: transactionsInfo.map(({ buyerAddress }, index) => ({
        buyerAddress,
        proof: merkleTree.getProof(index),
      })), // Bằng chứng cho mỗi buyerAddress
      treeLevel: merkleTreeLevel, // Cấp của cây Merkle
    };

    return processedData;
  } catch (error) {
    console.error("Error processing block data:", error);
    throw error; // Ném lỗi để dễ dàng debug
  }
};

// Hàm xây dựng cây Merkle từ một danh sách các hash
const buildMerkleTree = (leaves) => {
  const tree = new MerkleTree(leaves);
  return tree;
};

// Hàm tính toán cấp của cây Merkle (log2(n) và làm tròn lên nếu là số thập phân)
const calculateTreeLevel = (numberOfLeaves) => {
  const level = Math.ceil(Math.log2(numberOfLeaves)); // log2(n) và làm tròn lên
  return level;
};

// Mạch MerkleTree sử dụng Poseidon để tạo cây
class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves;
    this.levels = [leaves];
    this.buildTree();
  }

  buildTree() {
    let currentLevel = this.leaves;

    // Xây dựng cây Merkle
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const pair = currentLevel[i + 1] ? [currentLevel[i], currentLevel[i + 1]] : [currentLevel[i], currentLevel[i]];
        nextLevel.push(poseidon.poseidon(pair)); // Hash từng cặp bằng Poseidon
      }
      this.levels.push(nextLevel);
      currentLevel = nextLevel;
    }
  }

  get root() {
    return this.levels[this.levels.length - 1][0]; // Lấy Merkle root từ cấp cuối cùng
  }

  getProof(index) {
    let proof = [];
    let currentIndex = index;

    // Lấy bằng chứng Merkle cho index của một node
    for (let i = 0; i < this.levels.length - 1; i++) {
      const currentLevel = this.levels[i];
      const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
      proof.push(currentLevel[siblingIndex]);
      currentIndex = Math.floor(currentIndex / 2); // Di chuyển lên cấp trên
    }

    return proof;
  }
}
