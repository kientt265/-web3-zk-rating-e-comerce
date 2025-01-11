pragma circom 2.1.2;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";


template ZkCoZkComerceNullifier() {

    signal input deadId;
    signal input privkey;
    component computedNullifier = Poseidon(2);
	computedNullifier.inputs[0] <== signature;
    computedNullifier.inputs[1] <== password;

    component checkNullifier = ForceEqualIfEnabled();
	checkNullifier.enabled <== 1;
	checkNullifier.in[0] <== computedNullifier.out;
	checkNullifier.in[1] <== nullifier;
}

