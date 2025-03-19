
import React from 'react'
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { hexToBytes, bytesToHex } from "ethereum-cryptography/utils";
import GetInput from './GetInput';
interface ComputePubkeyProps {
    dealId: string;
    productId: string;
    rating: string;
    address: string;
    msgHash: string;
    r: string;
    s: string;
    v: number;  
    comment: string;
    images: File[];
}
export const ComputePubkey: React.FC<ComputePubkeyProps> = ({
    dealId,
    productId,
    rating,
    address,
    msgHash,
    r,
    s,
    v,
    comment,
    images
})=> {
    const vString = v.toString();
    const recoverPubkey = (msgHash: string, r: string, s: string, v: string) => {
        const cleanHex = (str: string) => str.startsWith("0x") ? str.slice(2) : str;
        msgHash = cleanHex(msgHash);
        r = cleanHex(r);
        s = cleanHex(s);
    
        if (msgHash.length !== 64 || r.length !== 64 || s.length !== 64) {
            throw new Error("Invalid input length: msgHash, r, and s must be 32 bytes (64 hex characters)");
        }
    
        const msgHashBytes = hexToBytes(msgHash);
        const signature = new secp256k1.Signature(BigInt("0x" + r), BigInt("0x" + s));
    
        // Thêm recovery bit vào chữ ký
        const signatureWithRecovery = signature.addRecoveryBit(Number(v) - 27 );
        
        console.log("Trying recoveryId:", Number(v) - 27  );
    
        try {
            // Khôi phục public key
            const publicKey = signatureWithRecovery.recoverPublicKey(msgHashBytes);
            
            const uncompressedKey = bytesToHex(publicKey.toRawBytes(false)).slice(2); // Bỏ tiền tố 04

            return {
                x: uncompressedKey.slice(0, 64),
                y: uncompressedKey.slice(64, 128)
            };
        } catch (error) {
            console.error("Failed to recover public key:", error);
            throw error;
        }
    }
    


        //uncompressed bỏ 04, lấy nửa đầu làm x, nửa sau làm y
        function split256To64BitChunks(num: bigint) {
            const mask = BigInt((1n << 64n) - 1n); // Mặt nạ 64-bit: 2^64 - 1
            const chunks = [];
            
            for (let i = 0; i < 4; i++) {
                const chunk = (num >> BigInt(i * 64)) & mask;
                chunks.push(chunk.toString()); // Chuyển sang string để dùng trong JSON
            }
            
            return chunks;
        }

        const pubkey = recoverPubkey(msgHash, r, s, vString);
        const xBigInt = BigInt("0x" + pubkey.x);
        const yBigInt = BigInt("0x" + pubkey.y);
        const xChunks = split256To64BitChunks(xBigInt);
        const yChunks = split256To64BitChunks(yBigInt);
        const input = {
            pubkey: [xChunks, yChunks]
        };
        console.log(JSON.stringify(input, null, 2));
    
  return (
    <div>
      <GetInput 
        dealId = {dealId}
        productId= {productId}
        rating={rating}
        address = {address}
        msgHash= {msgHash}
        r= {r}
        s={s}
        v= {vString}
        pubkey={input.pubkey}
        comment={comment}
        images={images}

      />
    </div>
  )
}
