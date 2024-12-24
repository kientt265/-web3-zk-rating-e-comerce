import * as circomlibjs from 'circomlibjs';

// Phương pháp 1: Sử dụng bigint-conversion
export function bufToBigint(buf) {
  let bits = 8n;
  if (ArrayBuffer.isView(buf)) bits = BigInt(buf.BYTES_PER_ELEMENT * 8);
  else buf = new Uint8Array(buf);

  let ret = 0n;
  for (const i of (buf).values()) {
    const bi = BigInt(i);
    ret = (ret << bits) + bi;
  }
  return ret;
}



// Phương pháp 4: Sử dụng phương pháp reduce
function uint8ArrayToBigIntUsingReduce(arr) {
  return arr.reduce((acc, byte) => (acc << 8n) + BigInt(byte), 0n);
}

async function testPoseidonHash() {
  try {
    // Xây dựng Poseidon hash function
    const poseidon = await circomlibjs.buildPoseidon();

    // Chuyển chuỗi '123' thành mảng các mã ASCII
    const root1 = [
        214, 245,  10, 170, 176,  21, 179, 228,
        149,  45,  85, 221, 165,  41, 232,   7,
        253, 220, 211, 103,  96, 196, 188,  90,
        244,  27,  34,  13, 111,  67,  56,  25
      ]
    const value1 = [
        175, 248,  29,  66, 206, 163, 234, 229,
        128,  64, 213,   5,  98, 107,  93, 160,
         32, 196, 157, 155, 148,  11, 148, 192,
         95, 239, 179, 200,   2, 135,  31,  33
      ]
    const sil1 = [
        120, 250,  27, 187, 115, 144, 221, 215,
        219,  22, 234, 181,  76, 123, 150, 146,
        129, 147, 159, 152,  68,  70,  30,  74,
        102, 135,  66,  20, 127,  55,  43,  13
      ]
    const sil2 = [
        143,  36,  23, 180, 239, 118, 119, 108,
        161, 214,  36,  54, 147,  79, 180,  49,
         13,  27, 174, 171, 240, 184, 171, 181,
        124, 117,  44, 177, 235, 200, 157,   4
      ]
    // const inputString = '123';
    // const inputArray = Array.from(inputString).map(char => BigInt(char.charCodeAt(0)));

    // // Tạo Poseidon hash từ giá trị đầu vào (mảng mã ASCII)
    // const bigIntHash = poseidon(inputArray);
    // const stringHash = poseidon.F.toString(bigIntHash);
    
    // console.log('Poseidon Hash (BigInt):', bigIntHash); // In ra BigInt
    // console.log('Poseidon Hash (String):', stringHash); // In ra chuỗi

    // Chuyển đổi bigIntHash sang Uint8Array để kiểm tra
    // const hashArray = new Uint8Array(bigIntHash);

    // Phương pháp 1: Sử dụng bigint-conversion
    const root11 = bufToBigint(root1);
    console.log('BigInt từ bufToBigint:', root11);


    // Phương pháp 4: Sử dụng phương pháp reduce
    const root14 = uint8ArrayToBigIntUsingReduce(root1);
    console.log('BigInt từ phương pháp reduce:', root14);
//=======================================================
    // Phương pháp 1: Sử dụng bigint-conversion
    const value11 = bufToBigint(value1);
    console.log('BigInt từ bufToBigint:', value11);


    // Phương pháp 4: Sử dụng phương pháp reduce
    const value14 = uint8ArrayToBigIntUsingReduce(value1);
    console.log('BigInt từ phương pháp reduce:', value14);
//=======================================================
    // Phương pháp 1: Sử dụng bigint-conversion
    const sil11 = bufToBigint(sil1);
    console.log('BigInt từ bufToBigint:', sil11);


    // Phương pháp 4: Sử dụng phương pháp reduce
    const sil14 = uint8ArrayToBigIntUsingReduce(sil1);
    console.log('BigInt từ phương pháp reduce:', sil14);
//=======================================================
    // Phương pháp 1: Sử dụng bigint-conversion
    const sil21 = bufToBigint(sil2);
    console.log('BigInt từ bufToBigint:', sil21);


    // Phương pháp 4: Sử dụng phương pháp reduce
    const sil24 = uint8ArrayToBigIntUsingReduce(sil2);
    console.log('BigInt từ phương pháp reduce:', sil24);
//=======================================================
    

  } catch (error) {
    console.error('Error hashing with Poseidon:', error);
  }
}

testPoseidonHash();