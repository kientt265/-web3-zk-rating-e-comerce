export const  hexToBigInt = (hexAddress) => {
    // Kiểm tra địa chỉ bắt đầu với "0x", nếu có thì bỏ đi
    if (hexAddress.startsWith("0x")) {
      hexAddress = hexAddress.slice(2);
    }
  
    // Chuyển địa chỉ hex sang BigInt
    return BigInt(`0x${hexAddress}`);
  };
  

  // const walletAddress = "0x2BEF6298f46817f7391A852dfc6669492Ea72d90";
  // const walletBigInt = hexToBigInt(walletAddress);
  

