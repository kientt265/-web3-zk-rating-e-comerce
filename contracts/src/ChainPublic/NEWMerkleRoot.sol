// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IVerifier {
    function verifyProof(
        uint256[2] memory _pA,
        uint256[2][2] memory _pB,
        uint256[2] memory _pC,
        uint256[42] memory _pubSignals
    ) external view returns (bool);
}

contract SaveMerkleRoot {
    mapping(uint256 blockNumber => string merkleRoot) listMerkleRoot;
    mapping(address => bool) validators;
    address public owner;
    address public verifyValidatorContract;

    constructor() {
        owner = msg.sender;
    }

     function registerValidator(address _validator) public {
        require(msg.sender == owner, "Only owner can sign");
        validators[_validator] = true;
    }


    function addRoot(uint256 _blockNumber, string memory _merkleRoot,  uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[42] calldata _pubSignals) public {
        require(validators[msg.sender] == true, "You must to true valid validator");
        bool proofValid = IVerifier(verifyValidatorContract).verifyProof(_pA, _pB, _pC, _pubSignals);
        require(proofValid, "Invalid Proof!");
        listMerkleRoot[_blockNumber] = _merkleRoot;
    }

    function getRootByBlockNumber(uint256 _blockNumber) public view returns(string memory) {
        return listMerkleRoot[_blockNumber];
    }
}