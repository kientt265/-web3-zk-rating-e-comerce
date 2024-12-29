import * as circomlib from 'circomlibjs'; 

async function createMerkleTree() {
    const poseidon = await circomlib.buildPoseidon();
    const hashArray = poseidon(["1166269347138129896463093449554139502969982402535", "20"]);
    // const hashArray = new Uint8Array(poseidonHash1);

    console.log(poseidon.F.toString(hashArray));
    console.log(hashArray);

        
    

}
createMerkleTree()