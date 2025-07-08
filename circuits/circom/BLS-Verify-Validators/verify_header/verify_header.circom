pragma circom 2.0.2;

include "./header_verification.circom";

component main {public [signing_root, syncCommitteePoseidon]} = VerifyHeader(150, 55, 7);