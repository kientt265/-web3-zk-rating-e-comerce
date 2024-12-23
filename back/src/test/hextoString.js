// Hàm chuyển hex thành int
function hexToInt(hex) {
    // Sử dụng parseInt với cơ sở 16 để chuyển đổi từ hex sang int
    return parseInt(hex, 16);
  }
  
  // Ví dụ sử dụng
  const hexString = '0x000000000000000000000000000000000000000000000000000000000000000e';  // Hex của số 26
  const result = hexToInt(hexString);
  
  console.log(result);  // Output: 26
  