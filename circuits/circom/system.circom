pragma circom 2.1.0;
include "circomlib/circuits/babyjub.circom";
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/smt/smtverifier.circom";

template ZkAddress() {
    	signal input keyHash;
    	signal output address;
    	// Get the binary representation of the input
    	component n2b = Num2Bits_strict();
    	n2b.in <== keyHash; 
		// Define the number of bits that fit into the default Vochain Address size
		var vochainAddrBits = 160; // (20 bytes * 8 bits/byte)
		// Get the binary representation of the hash of the public key that 
		// completes the address size
    	var addrBits[vochainAddrBits];
    	for (var i=0; i<vochainAddrBits; i++) {
    	    addrBits[i] = n2b.out[i];
    	}
    	// Return the binary address to its decimal representation
    	component b2n = Bits2Num(vochainAddrBits);
    	b2n.in <== addrBits;
    	b2n.out ==> address;
}


template Census(nLevels) {
	var realNLevels = nLevels+1;
	// defined by the process
	signal input productID; // public
	signal input censusRoot; // public

	// defined by the user
	signal input nullifier; // public


	// private signals

	signal input censusSiblings[realNLevels];
	signal input privateKey;


	// compute publicKey
	component babyPbk = BabyPbk();
	babyPbk.in <== privateKey;

	// compute keyHash, which will be at the leaf
	component keyHash = Poseidon(2);
	keyHash.inputs[0] <== babyPbk.Ax;
	keyHash.inputs[1] <== babyPbk.Ay;

	component vochainAddr = ZkAddress();
        vochainAddr.keyHash <== keyHash.out;

	// check the Merkletree with CensusRoot, siblings, keyHash and weight
	component smtClaimExists = SMTVerifier(realNLevels);
	smtClaimExists.enabled <== 1;
	smtClaimExists.fnc <== 0; // 0 as is to verify inclusion
	smtClaimExists.root <== censusRoot;
	for (var i=0; i<realNLevels; i++) {
		smtClaimExists.siblings[i] <== censusSiblings[i];
	}
	smtClaimExists.oldKey <== 0;
	smtClaimExists.oldValue <== 0;
	smtClaimExists.isOld0 <== 0;
	smtClaimExists.key <== vochainAddr.address;
	smtClaimExists.value <== 1;

	// check nullifier (electionID + privateKey)
	component computedNullifier = Poseidon(2);
	computedNullifier.inputs[0] <== privateKey;
	computedNullifier.inputs[1] <== productID;
	component checkNullifier = ForceEqualIfEnabled();
	checkNullifier.enabled <== 1;
	checkNullifier.in[0] <== computedNullifier.out;
	checkNullifier.in[1] <== nullifier;
}
component main = Census(20);