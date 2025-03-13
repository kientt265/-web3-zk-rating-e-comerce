export const  hexToBigInt = (hexAddress) => {
    // Kiểm tra địa chỉ bắt đầu với "0x", nếu có thì bỏ đi
    if (hexAddress.startsWith("0x")) {
      hexAddress = hexAddress.slice(2);
    }
  
    // Chuyển địa chỉ hex sang BigInt
    return BigInt(`0x${hexAddress}`);
  };

  let value = hexToBigInt("90c48915b33285273424beb79fc6bfec46d1c5bb8f429e148ed6ed537e905d4a");
  console.log(value);