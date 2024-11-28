// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DealComerce} from "../../src/PrivateChain/Deal/DealComerce.sol";

contract DeployDeal is Script {
    DealComerce public dealComerce;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        dealComerce = new DealComerce();

        vm.stopBroadcast();
    }
}