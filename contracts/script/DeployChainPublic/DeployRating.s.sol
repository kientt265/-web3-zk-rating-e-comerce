// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Rating} from "../../src/ChainPublic/Rating.sol";

contract DeployRating is Script {
    Rating public rating;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        rating = new Rating();

        vm.stopBroadcast();
    }
}