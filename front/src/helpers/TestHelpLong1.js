const circomlibjs = require("circomlibjs");
const fs = require("fs");
const crypto = require("crypto");

async function main() {
    console.log("⏳ Building Poseidon...");
    const poseidon = await circomlibjs.buildPoseidon();
    console.log("✅ Poseidon built.");

    console.log("⏳ Building BabyJub...");
    const babyJub = await circomlibjs.buildBabyjub();
    console.log("✅ BabyJub built.");

    console.log("⏳ Building EdDSA...");
    const eddsa = await circomlibjs.buildEddsa();
    console.log("✅ EdDSA built.");

    const assetID = 123456;
    console.log("Asset ID:", assetID);

    // Generate private key
    const prvKeyBuf = crypto.randomBytes(32);
    const pubKey = eddsa.prv2pub(prvKeyBuf); // pubKey is [x, y] BigInts

    // Hash assetID using Poseidon
    const msgHashBigInt = poseidon.F.toObject(poseidon([BigInt(assetID)]));
    const msgHashBuf = bigIntToBuffer32(msgHashBigInt); // msgHashBuf is 32-byte Buffer

    // Sign the message
    const signature = eddsa.signPoseidon(prvKeyBuf, msgHashBuf);
    // signature.R8 is [x, y] BigInts
    // signature.S is BigInt

    // PACK POINTS FOR CIRCOM INPUT
    // R8: Pack the signature's R8 point ([x, y] BigInt) into a 32-byte Buffer, then convert to 256 bits
    const R8_packed = babyJub.packPoint(signature.R8); // Returns a 32-byte Buffer
    const R8_bits = bufferToBitArray256(R8_packed);

    // S: Convert S (BigInt) to a 32-byte Buffer, then to 256 bits
    const S_buf = eddsa.F.fromMontgomery(signature.S); // Convert from Montgomery to regular BigInt
    const S_bits = bigIntToBitArray256(S_buf);

    // A: Pack the public key A point ([x, y] BigInt) into a 32-byte Buffer, then convert to 256 bits
    const A_packed = babyJub.packPoint(pubKey); // Returns a 32-byte Buffer
    const A_bits = bufferToBitArray256(A_packed);


    // Build input for Circom
    const input = {
        assetID: assetID.toString(),
        R8: R8_bits, // Now a single 256-bit array
        S: S_bits,    // Now a single 256-bit array
        A: A_bits     // Now a single 256-bit array
    };

    fs.writeFileSync("./input.json", JSON.stringify(input, null, 2));
    console.log("✅ Đã tạo input/input.json!");

    // Verify signature in JS (optional, for sanity check)
    const isValid = eddsa.verifyPoseidon(msgHashBuf, signature, pubKey);
    console.log("✅ Signature valid?", isValid);
}

// Convert BigInt to 32-byte buffer
function bigIntToBuffer32(num) {
    let hex = num.toString(16);
    if (hex.length % 2) hex = "0" + hex;
    const buf = Buffer.from(hex, "hex");
    if (buf.length < 32) {
        const padding = Buffer.alloc(32 - buf.length, 0);
        return Buffer.concat([padding, buf]);
    }
    return buf;
}

// Convert BigInt to 256-bit array (for S)
function bigIntToBitArray256(bn) {
    const bits = [];
    // Changed: count from 255 down to 0 for big-endian to little-endian conversion
    for (let i = 255; i >= 0; i--) {
        bits.push((bn >> BigInt(i)) & 1n ? 1 : 0);
    }
    return bits;
}

// Convert 32-byte Buffer (packed point) to 256-bit array
function bufferToBitArray256(buf) {
    const bits = [];
    // Changed: process bytes in reverse order
    for (let i = 31; i >= 0; i--) {
        // Changed: process bits in reverse order within each byte
        for (let j = 7; j >= 0; j--) {
            bits.push((buf[i] >> j) & 1);
        }
    }
    return bits;
}


main().catch((e) => {
    console.error("❌ Lỗi:", e);
});