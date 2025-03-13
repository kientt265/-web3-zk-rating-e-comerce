// Hàm chia một số BigInt 256-bit thành 4 phần 64-bit
function split256To64BitChunks(num) {
    const mask = BigInt((1n << 64n) - 1n); // Mặt nạ 64-bit: 2^64 - 1
    const chunks = [];
    
    for (let i = 0; i < 4; i++) {
        const chunk = (num >> BigInt(i * 64)) & mask;
        chunks.push(chunk.toString()); // Chuyển sang string để dùng trong JSON
    }
    
    return chunks;
}

// Tọa độ x và y dưới dạng BigInt
const x = BigInt("7117679278969255260133803158642161568174480902034171795225979302865441373936");
const y = BigInt("65480298344966996556242981008108438902895139046070777826780241467212745956682");

// Chia thành 4 phần
const xChunks = split256To64BitChunks(x);
const yChunks = split256To64BitChunks(y);

// Tạo input JSON
const input = {
    pubkey: [xChunks, yChunks]
};

console.log(JSON.stringify(input, null, 2));