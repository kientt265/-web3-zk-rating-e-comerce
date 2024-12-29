pragma circom 2.1.2;

include "./circomlib/circuits/poseidon.circom";
include "./circomlib/circuits/smt/smtverifier.circom";

template test(nLevels) {
    signal input rootMerkle;
    signal input siblingsMerkle[nLevels];
    signal input key;
    signal input value;

    component sikVerifier = SMTVerifier(nLevels);
        sikVerifier.enabled <== 1;
        sikVerifier.fnc <== 0;
        sikVerifier.root <== rootMerkle;
        for (var i=0; i<nLevels; i++) {
            sikVerifier.siblings[i] <== siblingsMerkle[i];
        }
        sikVerifier.oldKey <== 0;
        sikVerifier.oldValue <== 0;
        sikVerifier.isOld0 <== 0;
        sikVerifier.key <== key;
        sikVerifier.value <== value;
}

component main {public [rootMerkle, siblingsMerkle, key, value]} = test(2);