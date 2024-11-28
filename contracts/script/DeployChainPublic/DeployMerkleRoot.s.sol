// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MerkleRoot} from "../../src/ChainPublic/MerkleRoot.sol";

contract DeployMerkleRoot is Script {
    MerkleRoot public merkleRoot;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        merkleRoot = new MerkleRoot();

        vm.stopBroadcast();
    }
}