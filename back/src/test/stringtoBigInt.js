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
    const inputString = 'quan01';
    const inputArray = Array.from(inputString).map(char => BigInt(char.charCodeAt(0)));

    // Tạo Poseidon hash từ giá trị đầu vào (mảng mã ASCII)
    const bigIntHash = poseidon(inputArray);
    const stringHash = poseidon.F.toString(bigIntHash);
    
    console.log('Poseidon Hash (BigInt):', bigIntHash); // In ra BigInt
    console.log('Poseidon Hash (String):', stringHash); // In ra chuỗi

    // Chuyển đổi bigIntHash sang Uint8Array để kiểm tra
    const hashArray = new Uint8Array(bigIntHash);

    // Phương pháp 1: Sử dụng bigint-conversion
    const bigIntFromBuf = bufToBigint(hashArray);
    console.log('BigInt từ bufToBigint:', bigIntFromBuf);

    // Phương pháp 4: Sử dụng phương pháp reduce
    const bigIntFromReduce = uint8ArrayToBigIntUsingReduce(hashArray);
    console.log('BigInt từ phương pháp reduce:', bigIntFromReduce);

  } catch (error) {
    console.error('Error hashing with Poseidon:', error);
  }
}

testPoseidonHash();