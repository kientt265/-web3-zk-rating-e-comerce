import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { hexToBytes, bytesToHex } from "ethereum-cryptography/utils";

function recoverPublicKey(msgHash, r, s, v) {
    const cleanHex = (str) => str.startsWith("0x") ? str.slice(2) : str;
    msgHash = cleanHex(msgHash);
    r = cleanHex(r);
    s = cleanHex(s);

    if (msgHash.length !== 64 || r.length !== 64 || s.length !== 64) {
        throw new Error("Invalid input length: msgHash, r, and s must be 32 bytes (64 hex characters)");
    }

    const msgHashBytes = hexToBytes(msgHash);
    const signature = new secp256k1.Signature(BigInt("0x" + r), BigInt("0x" + s));

    // Thêm recovery bit vào chữ ký
    const signatureWithRecovery = signature.addRecoveryBit(v - 27);
    
    console.log("Trying recoveryId:", v - 27);

    try {
        // Khôi phục public key
        const publicKey = signatureWithRecovery.recoverPublicKey(msgHashBytes);
        
        // Trả về cả public key nén (compressed) và không nén (uncompressed)
        return {
            compressed: bytesToHex(publicKey.toRawBytes()), // 33 bytes
            uncompressed: bytesToHex(publicKey.toRawBytes(false)) // 65 bytes
        };
    } catch (error) {
        console.error("Failed to recover public key:", error.message);
        throw error;
    }
}

// Ví dụ sử dụng
const msgHash = "25674ba4b416425b2ac42fdb33d0b0c20c59824a76e1ee4ecc04b8d48f8f6af7";
const r = "33d940fd83ec3f5b612e02fde2c37196e7a03a9611da3cc4f4fc902d49d3c412";
const s = "30745b6cb8cc806f8d7beb8e0f3492e5c6d5d4ebad9ca80cdd74f669b1783b0f";

try {
    const { compressed, uncompressed } = recoverPublicKey(msgHash, r, s, 28);
    console.log("Recovered Public Key (compressed, v=28):", compressed);
    console.log("Recovered Public Key (uncompressed, v=28):", uncompressed);
} catch (e) {
    console.log("Trying v=27...");
    const { compressed, uncompressed } = recoverPublicKey(msgHash, r, s, 27);
    console.log("Recovered Public Key (compressed, v=27):", compressed);
    console.log("Recovered Public Key (uncompressed, v=27):", uncompressed);
}
