export const bigIntToHex = (bigIntValue) => {
    // Chuyển BigInt thành chuỗi hex, loại bỏ "0x" mặc định
    let hexString = bigIntValue.toString(16);
  
    // Đảm bảo độ dài chuỗi hex là bội số của 2 để tránh mất dữ liệu
    if (hexString.length % 2 !== 0) {
      hexString = "0" + hexString;
    }
  
    // Thêm tiền tố "0x" và trả về kết quả
    return "0x" + hexString;
  };
  
  // Test thử
  let bigIntValue = BigInt("633312402075039977350098731221198159830618857134");
  console.log(bigIntToHex(bigIntValue));
  