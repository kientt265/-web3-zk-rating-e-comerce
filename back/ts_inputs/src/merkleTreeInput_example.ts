import * as arbo from "./arbo_utils.js";


export interface CircuitVerifyMerkleTreeInputs{
    dealId: string;
    buyerAddress: string;
    transactionHash: string;
    censusRoot: string;
    censusSiblings: string[];
}
export async function GenerateCircuitVerifyMerkleTreeInputs(
    dealId: string,
    buyerAddress: string,
    transactionHash: string,
    censusRoot: string,
    censusSiblings: string[]) : Promise<CircuitVerifyMerkleTreeInputs>{
    //const arboDealId = await arbo.toHash(dealId);
    return  {
        dealId,
        buyerAddress: arbo.toBigInt(buyerAddress).toString(),
        transactionHash: arbo.toBigInt(transactionHash).toString(),
        censusRoot,
        censusSiblings,
    };

}