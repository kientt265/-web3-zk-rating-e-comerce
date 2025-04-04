import * as circomlibjs from 'circomlibjs';

export const zkProofHelpers = {
  // Add 0x prefix if not present
  addHexPrefix(value: string): string {
    return value.startsWith('0x') ? value : '0x' + value;
  },

  // Split hex string into 4 parts and convert to BigInt
  splitAndReverseBigInt(hexStr: string): BigInt[] {
    // Ensure hex has 0x prefix for consistent handling
    const hexWithPrefix = this.addHexPrefix(hexStr);
    const cleanHex = hexWithPrefix.slice(2);
    
    // Ensure string length is even
    const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
    
    // Split into 4 equal parts
    const partLength = Math.ceil(paddedHex.length / 4);
    const parts: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      const start = i * partLength;
      const part = paddedHex.slice(start, start + partLength).padStart(partLength, '0');
      parts.push(part);
    }

    // Convert to BigInt and reverse
    return parts.map(part => BigInt('0x' + part)).reverse();
  },

  // Convert hex to BigInt (for values with 0x prefix)
  hexToBigInt(hexStr: string): BigInt {
    return BigInt(hexStr);
  },

  // Convert non-0x hex to BigInt
  rawHexToBigInt(hexStr: string): BigInt {
    return BigInt('0x' + hexStr);
  },

  // Convert decimal string to BigInt
  decimalToBigInt(decStr: string): BigInt {
    return BigInt(decStr);
  },

  // Calculate nullifier using poseidon hash
    // Calculate nullifier using poseidon hash
    async calculateNullifier(
        privateKey: string, 
        productId: string,
        dealId: string, 
      ): Promise<string> {  // Changed return type to string
        const poseidon = await circomlibjs.buildPoseidon();
        
        const privKeyBigInt = BigInt('0x' + privateKey);
        const productIdBigInt = BigInt('0x' + productId);
        const dealIdBigInt = BigInt(dealId);
        
        const hash = poseidon([privKeyBigInt,productIdBigInt, dealIdBigInt ]);
        return poseidon.F.toString(hash);  // Return directly without additional toString()
      },

  // Prepare all inputs for ZK proof
  async prepareZKInputs(params: {
    privateKey: string;  // without 0x
    dealId: string;     // decimal
    productId: string;  // without 0x
    r: string;         // with 0x
    s: string;         // with 0x
    msgHash: string;   // with 0x
  }) {
    const {privateKey, dealId, productId, r, s, msgHash} = params;
    const nullifier = await this.calculateNullifier(privateKey,productId, dealId);
    // Process private key (no 0x)
    const privateKeyParts = this.splitAndReverseBigInt(privateKey);
    const privateKeyForNullifier = this.rawHexToBigInt(privateKey);

    // Process r and s (with 0x)
    const rParts = this.splitAndReverseBigInt(r);
    const sParts = this.splitAndReverseBigInt(s);
    const masgHashParts = this.splitAndReverseBigInt(msgHash);
    // Process msgHash (with 0x)
    const msgHashBigInt = this.hexToBigInt(msgHash);

    // Process productId (no 0x)
    const productIdBigInt = this.rawHexToBigInt(productId);

    // Calculate nullifier


    return {
      privateKeyParts,
      privateKeyForNullifier,
      dealId: this.decimalToBigInt(dealId),
      productIdBigInt,
      rParts,
      sParts,
      masgHashParts,
      nullifier
    };
  }
};