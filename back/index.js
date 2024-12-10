import WebSocket from 'ws'; // Thay vì require('ws')
import fetch from 'node-fetch';
import * as circomlibjs from 'circomlibjs';
import { MongoClient } from 'mongodb';

const poseidon = circomlibjs.poseidon;

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
const besuWebSocketUrl = 'ws://127.0.0.1:8546'; // Địa chỉ node Besu
const ws = new WebSocket(besuWebSocketUrl);

// MongoDB URI và kết nối
const uri = "mongodb+srv://21522250:jqJYggw856bCpVEQ@cluster0.skrd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function saveMerkleData(merkleRoot, merkleProof, blockHash) {
    try {
        await client.connect();
        const database = client.db('merkleDB'); // Cơ sở dữ liệu bạn muốn sử dụng
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

ws.on('open', () => {
    console.log('Connected to Besu WebSocket');
    ws.send(JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_subscribe",
        params: ["newHeads"],
        id: 1
    }));
});

ws.on('message', async (data) => {
    const response = JSON.parse(data);
    if (response.method === "eth_subscription") {
        const blockHash = response.params.result.hash;
        console.log(`New block detected: ${blockHash}`);
        await fetchBlockData(blockHash);
    }
});

// Lấy dữ liệu block từ JSON-RPC
async function fetchBlockData(blockHash) {
    const response = await fetch('http://127.0.0.1:8545', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBlockByHash",
            params: [blockHash, true],
            id: 1
        })
    });

    const blockData = await response.json();
    if (blockData.result) {
        const transactions = blockData.result.transactions.map(tx => tx.hash);
        console.log(`Transactions in block:`, transactions);

        // Tạo cây Merkle
        const merkleTree = new MerkleTree(transactions);
        const merkleRoot = merkleTree.getRoot();
        console.log("Merkle Root:", merkleRoot);

        // Lấy proof cho từng leaf (ví dụ index 0)
        const merkleProof = merkleTree.getProof(0);
        console.log("Merkle Proof:", merkleProof);

        // Lưu dữ liệu vào MongoDB
        await saveMerkleData(merkleRoot, merkleProof, blockHash);
    }
}
