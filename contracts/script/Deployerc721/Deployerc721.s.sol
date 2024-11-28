// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Erc721} from "../../src/Product/erc721.sol";

contract Deployerc721 is Script{
    Erc721 public erc721;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        erc721 = new Erc721("Description Product", "DP");

        vm.stopBroadcast();
    }
}