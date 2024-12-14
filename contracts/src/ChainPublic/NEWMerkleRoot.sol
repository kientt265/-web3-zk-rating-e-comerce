// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract MerkleRoot {
    mapping(uint256 blockNumber => bytes32 merkleRoot) listMerkleRoot;
    function addRoot(uint256 _blockNumber, bytes32 _merkleRoot) public {
        listMerkleRoot[_blockNumber] = _merkleRoot;
    }

    function getRootByBlockNuber(uint256 _blockNumber) public view returns(bytes32) {
        return listMerkleRoot[_blockNumber];
    }
}