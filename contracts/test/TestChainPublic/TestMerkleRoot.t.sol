// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/ChainPublic/MerkleRoot.sol";

contract MerkleRootTest is Test {
    MerkleRoot private merkleRoot;

    function setUp() public {
        merkleRoot = new MerkleRoot();
    }

    function testAddRootAndRetrieveSenderHash() public {
        bytes32 merkleRootValue = keccak256(abi.encodePacked("merkleRoot"));
        bytes32 txHash = keccak256(abi.encodePacked("txHash"));
        bytes32 senderHash = keccak256(abi.encodePacked("senderHash"));

        merkleRoot.addRoot(merkleRootValue, txHash, senderHash);

        vm.expectEmit(true, true, true, true);
        emit MerkleRoot.MerkleRootAdded(merkleRootValue, txHash, senderHash);

        (bytes32 retrievedSenderHash, bytes32 retrievedMerkleRoot) = merkleRoot.getSenderHash(txHash);

        assertEq(retrievedSenderHash, senderHash, "Sender hash invalid");
        assertEq(retrievedMerkleRoot, merkleRootValue, "Merkle root invalid");
    }

    function testRetrieveNonExistentTxHash() public {
        bytes32 txHash = keccak256(abi.encodePacked("nonExistentTxHash"));

        (bytes32 senderHash, bytes32 merkleRootValue) = merkleRoot.getSenderHash(txHash);

        assertEq(senderHash, bytes32(0), "Sender hash not bytes32(0)");
        assertEq(merkleRootValue, bytes32(0), "Merkle root not bytes32(0)");
    }
}
