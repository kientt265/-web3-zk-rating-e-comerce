pragma circom 2.1.2;

include "./circomlib/circuits/poseidon.circom";
include "./circomlib/circuits/comparators.circom";
include "./circomlib/circuits/smt/smtverifier.circom";

template ZkComerceVerifyMerkleTree () {
    signal input nLevels;
    var realNLevels = nLevels+1;
    signal input dealId;
    signal input censusRoot;
    signal input censusSiblings[realNLevels];
    signal input buyerAddress;
    signal input tsxHash[2];

    
    component createValue = Poseidon(3);
        createValue.inputs[0] <== buyerAddress;
        createValue.inputs[1] <== tsxHash[0];
        createValue.inputs[2] <== tsxHash[1];

    component censusVerifier = SMTVerifier(realNLevels);
        censusVerifier.enabled <== 1;
        censusVerifier.fnc <== 0;
        censusVerifier.root <== censusRoot;
        for (var i=0; i<realNLevels; i++) {
		    censusVerifier.siblings[i] <== censusSiblings[i];
	    }
        censusVerifier.oldKey <== 0;
	    censusVerifier.oldValue <== 0;
	    censusVerifier.isOld0 <== 0;
        censusVerifier.key <== dealId ;
        censusVerifier.value <== createValue.out;
}
component main {public [nLevels, dealId, censusRoot, censusSiblings, buyerAddress, tsxHash]} = ZkComerceVerifyMerkleTree();