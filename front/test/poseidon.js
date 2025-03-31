import * as circomlibjs from 'circomlibjs';

const poseidon123 = async (inputs) => {
  const poseidon = await circomlibjs.buildPoseidon();
  const inputBigInt = BigInt(inputs);
  const hash = poseidon([inputBigInt]);
  const hashBigInt = poseidon.F.toObject(hash);
  console.log('Hash as BigInt:', hashBigInt);
  return hashBigInt;
}

poseidon123("kien");