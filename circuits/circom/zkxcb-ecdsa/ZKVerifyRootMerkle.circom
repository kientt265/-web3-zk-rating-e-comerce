pragma circom 2.1.2;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/smt/smtverifier.circom";

template ZKVerifyRootMerkle(nLevels) {
    var realNLevels = nLevels+1;
    signal input rootMerkle;
    signal input siblingsMerkle[realNLevels];
    signal input key;
    signal input value1;
    signal input value2;

    component sik = Poseidon(2);
	sik.inputs[0] <== value1;
	sik.inputs[1] <== value2;

    component sikVerifier = SMTVerifier(realNLevels);
        sikVerifier.enabled <== 1;
        sikVerifier.fnc <== 0;
        sikVerifier.root <== rootMerkle;
        for (var i=0; i<realNLevels; i++) {
            sikVerifier.siblings[i] <== siblingsMerkle[i];
        }
        sikVerifier.oldKey <== 0;
        sikVerifier.oldValue <== 0;
        sikVerifier.isOld0 <== 0;
        sikVerifier.key <== key;
        sikVerifier.value <== sik.out;
}

// component main {public [rootMerkle, siblingsMerkle, key, value1, value2]} = ZKVerifyRootMerkle(20);