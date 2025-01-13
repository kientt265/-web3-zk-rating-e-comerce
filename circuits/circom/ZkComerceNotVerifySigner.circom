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
    signal input password;
    signal input tsxHash[2];
    signal input nullifier;
    signal input productId;

    
    component createValue = Poseidon(2);
        createValue.inputs[0] <== password;
        createValue.inputs[1] <== dealId;

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

    component computedNullifier = Poseidon(3);
	    computedNullifier.inputs[0] <== password;
        computedNullifier.inputs[1] <== dealId;
        computedNullifier.inputs[2] <== productId;

    component checkNullifier = ForceEqualIfEnabled();
        checkNullifier.enabled <== 1;
        checkNullifier.in[0] <== computedNullifier.out;
        checkNullifier.in[1] <== nullifier;        
        
}
component main {public [nLevels, dealId, censusRoot, censusSiblings, buyerAddress, tsxHash, nullifier, productId]} = ZkComerceVerifyMerkleTree();