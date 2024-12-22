const hexToBigInt = (hexAddress) => {
    // Kiểm tra địa chỉ bắt đầu với "0x", nếu có thì bỏ đi
    if (hexAddress.startsWith("0x")) {
      hexAddress = hexAddress.slice(2);
    }
  
    // Chuyển địa chỉ hex sang BigInt
    return BigInt(`0x${hexAddress}`);
  };
  
  // Ví dụ sử dụng
  const walletAddress = "0xcc495384bEC3A342387A0E0490a60C8f14F1bfE7";
  const walletBigInt = hexToBigInt(walletAddress);
  
  console.log("Wallet Address (Hex):", walletAddress);
  console.log("Wallet Address (BigInt):", walletBigInt);
  