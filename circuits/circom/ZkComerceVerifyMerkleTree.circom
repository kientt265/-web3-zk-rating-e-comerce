include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/smt/smtverifier.circom";

template ZkComerceVerifyMerkleTree (nLevels) {
    var realNLevels = nLevels+1;
    signal input censusRoot;
    signal input censusSiblings[realNLevels];
    signal input address;
    signal input tsxHash;

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
        censusVerifier.key <== address ;
        censusVerifier.value <== tsxHash;
}
component main {public [censusRoot, censusSiblings, address, tsxHash  ]} = ZkComerceVerifyMerkleTree(160);