// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Groth16Verifier} from "../../src/VerifyContract/NewVerifyEComerce.sol";

contract DeployMerkleRoot is Script {
    Groth16Verifier public groth16Verifier;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        groth16Verifier = new Groth16Verifier();

        vm.stopBroadcast();
    }
}