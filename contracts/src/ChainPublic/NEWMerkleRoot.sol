// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SaveMerkleRoot {
    mapping(uint256 blockNumber => string merkleRoot) listMerkleRoot;
    function addRoot(uint256 _blockNumber, string memory _merkleRoot) public {
        listMerkleRoot[_blockNumber] = _merkleRoot;
    }

    function getRootByBlockNuber(uint256 _blockNumber) public view returns(string memory) {
        return listMerkleRoot[_blockNumber];
    }
}