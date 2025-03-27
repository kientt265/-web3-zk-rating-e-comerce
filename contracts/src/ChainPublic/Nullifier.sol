// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Nullifier {
    mapping(string => bool) shopee;


    function addNullifier(string memory _nullifier) public {
        shopee[_nullifier] = false;
    }

    function getStatusNullifier(string memory _nullifier) public view returns(bool) {
        return shopee[_nullifier];
    }

    function updateStatusNullifier(string memory _nullifier) public {
        shopee[_nullifier] = true;
    }
}