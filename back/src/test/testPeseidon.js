import * as circomlibjs from 'circomlibjs';

async function testPoseidonHash() {
  try {
    // Xây dựng Poseidon hash function
    const poseidon = await circomlibjs.buildPoseidon();

    // Chuyển chuỗi 'Tranturngkien' thành mảng các mã ASCII
    const inputString = 'Tranturngkien';
    const inputArray = Array.from(inputString).map(char => char.charCodeAt(0));

    // Tạo Poseidon hash từ giá trị đầu vào (mảng mã ASCII)
    const hash = poseidon.F.toString(poseidon(inputArray));

    // In kết quả hash ra console
    console.log('Poseidon Hash of "Tranturngkien": ', hash);
  } catch (error) {
    console.error('Error hashing with Poseidon:', error);
  }
}

testPoseidonHash();
