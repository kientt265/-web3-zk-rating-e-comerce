pragma circom 2.1.2;


include "./ZKVerifyRootMerkle.circom";
include "./ZKSignature.circom";
include "./ZKPubToAdd.circom";
include  "../../node_modules/circomlib/circuits/comparators.circom";



template ZKEComerce(n, k, nLevels) {
    var realNLevels = nLevels+1;
    signal input rootMerkle;
    signal input siblingsMerkle[realNLevels];
    signal input privatekey[k];
    signal input privatekeyForNullifier;
    signal input dealId;
    signal input productId;
    signal input r[k];
    signal input s[k];
    signal input msghash[k];
    signal input nullifier;

    signal output res;

    component privToPub = ECDSAPrivToPub(n, k);
        for (var i = 0; i < k; i++) {
            privToPub.privkey[i] <== privatekey[i];
        }

    component flattenPub = FlattenPubkey(n, k);
        for (var i = 0; i < k; i++) {
            flattenPub.chunkedPubkey[0][i] <== privToPub.pubkey[0][i];
            flattenPub.chunkedPubkey[1][i] <== privToPub.pubkey[1][i];
        }

    component pubToAddr = PubkeyToAddress();
        for (var i = 0; i < 512; i++) {
            pubToAddr.pubkeyBits[i] <== flattenPub.pubkeyBits[i];
        }

    component zkverifyMerRoot = ZKVerifyRootMerkle(nLevels);
        zkverifyMerRoot.rootMerkle <== rootMerkle;
        zkverifyMerRoot.key <== dealId;
        zkverifyMerRoot.value1 <== dealId;
        zkverifyMerRoot.value2 <== pubToAddr.address;
        for (var i=0; i<realNLevels; i++) {
            zkverifyMerRoot.siblingsMerkle[i] <== siblingsMerkle[i];
        }

    component ecdsaVerify = ECDSAVerifyNoPubkeyCheck(n, k);
        for (var i = 0; i < k; i++) {
            ecdsaVerify.r[i] <== r[i];
            ecdsaVerify.s[i] <== s[i];
            ecdsaVerify.msghash[i] <== msghash[i];
            ecdsaVerify.pubkey[0][i] <== privToPub.pubkey[0][i];
            ecdsaVerify.pubkey[1][i] <== privToPub.pubkey[1][i];
        }

        res <== ecdsaVerify.result;
    //Mặc định zkverifyMerRoot là true nếu mạch được tạo thành công, nếu mạch không tạo được thì ZkverifyMerRoot sẽ trả về false 

    component computeNullifier = Poseidon(3);
        computeNullifier.inputs[0] <== privatekeyForNullifier;
        computeNullifier.inputs[1] <== productId;
        computeNullifier.inputs[2] <== dealId;
	
    component checkNullifier = ForceEqualIfEnabled();
        checkNullifier.enabled <== 1;
        checkNullifier.in[0] <== computeNullifier.out;
        checkNullifier.in[1] <== nullifier;

}

component main {public [rootMerkle, productId, msghash, nullifier]} = ZKEComerce(64, 4, 20);
