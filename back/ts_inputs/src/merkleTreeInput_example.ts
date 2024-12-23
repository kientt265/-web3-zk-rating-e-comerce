import * as arbo from "./arbo_utils.js";


export interface CircuitVerifyMerkleTreeInputs{
    buyerAddress: string;
    transactionHash: string;
    censusRoot: string;
    censusSiblings: string[];
}
export async function GenerateCircuitVerifyMerkleTreeInputs(
    buyerAddress: string,
    transactionHash: string,
    censusRoot: string,
    censusSiblings: string[]) : Promise<CircuitVerifyMerkleTreeInputs>{
    return  {
        buyerAddress: arbo.toBigInt(buyerAddress).toString(),
        transactionHash: arbo.toBigInt(transactionHash).toString(),
        censusRoot,
        censusSiblings,
    };

}