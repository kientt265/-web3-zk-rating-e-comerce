// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Nullifier {
    mapping(uint256 => bool) shopee;


    function getStatusNullifier(uint256 _nullifier) public view returns(bool) {
        return shopee[_nullifier];
    }

    function updateStatusNullifier(uint256 _nullifier) public {
        shopee[_nullifier] = true;
    }
}