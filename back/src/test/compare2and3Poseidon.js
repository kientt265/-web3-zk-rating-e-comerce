import * as circomlib from 'circomlibjs'; 

async function createValuePoseidon() {
    const poseidon = await circomlib.buildPoseidon();
    const poseidonHash1 = poseidon([2406251556709548429408877834911177812164747779, 242108076058607163538102198631955675649142667662805314151155817304537028292174]);
    console.log(poseidon.F.toString(poseidonHash1));
    const poseidonHash2 = poseidon([2406251556709548429408877834911177812164747779, 242108076058607163538102198631955675649,142667662805314151155817304537028292174]);
    console.log(poseidon.F.toString(poseidonHash2));
}
createValuePoseidon();