import fetch from 'node-fetch';
import * as circomlibjs from 'circomlibjs';
import { MongoClient } from 'mongodb';
import { poseidon } from 'circomlibjs';
import { MerkleTree } from './MerkleTree';

const besuHttpUrl = 'http://127.0.0.1:8545';
async function getLatestBlock() {
    try {
        const response = await fetch(besuHttpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getBlockByNumber",
                params: ["latest", true], // "latest" để lấy block mới nhất
                id: 1
            })
        });

        const data = await response.json();

        if (data.result) {
            console.log("Latest block data:", data.result);
        } else {
            console.error("Error fetching block:", data.error || "Unknown error");
        }
    } catch (err) {
        console.error("Error connecting to Besu:", err);
    }
}

// Gọi hàm để lấy block cuối cùng
getLatestBlock();
// Hàm băm Poseidon
function poseidonHash(inputs) {
    return poseidon(inputs);
}

// Tạo cây Merkle
class MerkleTree {
    constructor(leaves) {
        this.leaves = leaves.map(leaf => poseidonHash([BigInt(leaf)]));
        this.levels = [this.leaves];

        while (this.levels[this.levels.length - 1].length > 1) {
            this.levels.push(this.createNextLevel(this.levels[this.levels.length - 1]));
        }

        this.root = this.levels[this.levels.length - 1][0];
    }

    createNextLevel(previousLevel) {
        const nextLevel = [];
        for (let i = 0; i < previousLevel.length; i += 2) {
            const left = previousLevel[i];
            const right = previousLevel[i + 1] || left; // Nếu số lá lẻ
            nextLevel.push(poseidonHash([left, right]));
        }
        return nextLevel;
    }

    getRoot() {
        return this.root;
    }

    getProof(index) {
        let proof = [];
        let level = this.leaves;
        let currentIndex = index;

        // Lấy proof cho một leaf tại index
        for (let i = 0; i < this.levels.length - 1; i++) {
            const pairIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
            proof.push(level[pairIndex]);
            currentIndex = Math.floor(currentIndex / 2);
            level = this.levels[i + 1];
        }

        return proof;
    }
}

// Kết nối WebSocket với Besu



// MongoDB URI và kết nối
const uri = "mongodb+srv://21522250:jqJYggw856bCpVEQ@cluster0.skrd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function saveMerkleData(merkleRoot, merkleProof, blockHash) {
    try {
        await client.connect();
        const database = client.db('merkleDB'); // Cơ sở dữ li���u bạn muốn sử dụng
        const collection = database.collection('merkleTrees'); // Tên collection

        // Lưu dữ liệu vào MongoDB
        const document = {
            blockHash,
            merkleRoot: merkleRoot.toString(),
            merkleProof: merkleProof.map(item => item.toString()),
            timestamp: new Date(),
        };

        await collection.insertOne(document);
        console.log('Merkle data saved to MongoDB');
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
    } finally {
        await client.close();
    }
}

async function createMerkleTreeFromTransactions(transactions, pubkey) {
    // Tạo mảng các node lá
    const leaves = transactions.map(tx => {
        const transactionHash = tx.hash; // Lấy transaction hash
        // Băm transactionHash với pubkey
        return poseidon([BigInt(transactionHash), BigInt(pubkey)]);
    });

    // Tạo cây Merkle
    const merkleTree = new MerkleTree(leaves);
    return merkleTree;
}

async function main() {
    // Giả sử bạn đã lấy được dữ liệu block
    const blockData = {
        // ... dữ liệu block như bạn đã cung cấp ...
        transactions: [
            {
                hash: '0x5f532ffbbf99e736dfb4ae824654e24a819ac15606e05d8f28d7adae605cce76',
                // ... các thông tin khác ...
            },
            // ... thêm các giao dịch khác nếu có ...
        ]
    };

    const transactions = blockData.transactions; // Lấy danh sách giao dịch
    const pubkey = 'your_public_key_here'; // Thay thế bằng public key của bạn

    // Tạo cây Merkle từ các giao dịch
    const merkleTree = await createMerkleTreeFromTransactions(transactions, pubkey);

    // Lấy root và proof cho public key
    const merkleRoot = merkleTree.getRoot();
    const proof = merkleTree.getProof(0); // Lấy proof cho leaf đầu tiên (có thể thay đổi index)

    console.log("Merkle Root:", merkleRoot);
    console.log("Merkle Proof:", proof);
}

main().catch(console.error);
