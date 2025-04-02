function splitPrivateKey(privateKeyHex) {
    // Remove 0x if present
    privateKeyHex = privateKeyHex.replace('0x', '');
    
    // Ensure the key is 32 bytes (64 hex characters)
    while (privateKeyHex.length < 64) {
        privateKeyHex = "0" + privateKeyHex;
    }
    
    const result = [];
    // Split into 4 chunks of 16 hex characters (8 bytes = 64 bits each)
    for (let i = 3; i >= 0; i--) {  // Reverse order for little-endian
        const start = i * 16;
        const chunk = privateKeyHex.slice(start, start + 16);
        result.push(BigInt("0x" + chunk).toString());
    }
    
    return result;
}

// Test
const privateKey = "8d736906ec7a1cae1ac025eb320f06effc63cee13fa4c07fc5341b9b21bdc032";
console.log(splitPrivateKey(privateKey));