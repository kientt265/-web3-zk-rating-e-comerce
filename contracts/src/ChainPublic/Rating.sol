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

interface INullifier {
    function addNullifier(uint256 _nullifier) external;
    function getStatusNullifier(uint256  _nullifier) external view returns(bool);
    function updateStatusNullifier(uint256  _nullifier) external;
}
contract Rating {

    event NewRating(string  _productId, uint8 _rating, uint256 _ratingCount, uint256 _totalRating);

    address public verifyContract;
    address public nullifierContract;
    address public owner;
    mapping(string => uint256) private totalRating; 
    mapping(string => uint256) private ratingCount; 
    mapping(string => string) public hashRating;
    mapping(address => bool) public validators;


    constructor() {
        owner = msg.sender;
    }
    function registerValidator(address _validator) public {
        require(msg.sender == owner, "Only owner can sign");
        validators[_validator] = true;
    }

    function deleteValidator(address _validator) public {
        require(msg.sender == owner, "Only owner can sign");
        validators[_validator] = false;
    }

    function setVerifyContract(address _verifyContract) public {
        require(msg.sender == owner, "Only owner can sign");
        verifyContract = _verifyContract;
    }
    function setNullifierContract(address _nullifierContract) public {
        require(msg.sender == owner, "Only owner can sign");
        nullifierContract = _nullifierContract;
    }
    function ratingProduct(uint8 _star, string memory _productId,  uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[42] calldata _pubSignals, string memory hashM) public {
        require(validators[msg.sender]==true, "You must to true validator");
        uint256 _nullifier = _pubSignals[41];
        bool statusNullifier = INullifier(nullifierContract).getStatusNullifier(_nullifier);
        require(statusNullifier == false, "Nullifier be used");
        bool proofValid = IVerifier(verifyContract).verifyProof(_pA, _pB, _pC, _pubSignals);
        require(proofValid, "Invalid proof");
        require(_star >= 1 && _star <= 5, "Rating must be between 1 and 5 stars"); 
        INullifier(nullifierContract).updateStatusNullifier(_nullifier);
        hashRating[_productId] = hashM;
        totalRating[_productId] += _star; 
        ratingCount[_productId] += 1;

        emit NewRating(_productId, _star, ratingCount[_productId], totalRating[_productId]);
    }



    function getRatingCount(string memory _productId) public view returns (uint256) {
        return ratingCount[_productId];
    }
}