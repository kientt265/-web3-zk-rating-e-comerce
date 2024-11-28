// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract MerkleRoot {
    mapping (bytes32 => mapping (bytes32 => bytes32)) public merkleMapping;
    mapping (bytes32 => bytes32) transToRoot;
    event MerkleRootAdded(bytes32 merkleRoot, bytes32 txHash, bytes32 senderHash);

    function addRoot(bytes32 _merkleRoot, bytes32 _txHash, bytes32 _senderHash) public {
        merkleMapping[_merkleRoot][_txHash] = _senderHash;
        transToRoot[_txHash] = _merkleRoot;
        emit MerkleRootAdded(_merkleRoot, _txHash, _senderHash);
    }


    function getSenderHash(bytes32 _txHash) public view returns (bytes32, bytes32) {
        bytes32 _merkleRoot = transToRoot[_txHash];
        return (merkleMapping[_merkleRoot][_txHash], _merkleRoot);
    }
}