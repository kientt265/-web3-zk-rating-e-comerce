// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IVerifier {
    function verifyProof(
        uint256[2] memory _pA,
        uint256[2][2] memory _pB,
        uint256[2] memory _pC,
        uint256[25] memory _pubSignals
    ) external view returns (bool);
}
contract Rating {

    event NewRating(string  _productId, uint8 _rating, uint256 _ratingCount);

    address public verifyContract;

    mapping(string => uint256) private totalRating; 
    mapping(string => uint256) private ratingCount; 
    mapping(string => uint8) public currentRating; 
    mapping(string => bool) public nullifierUsed;

    constructor(address _verifyContract) {
        verifyContract = _verifyContract;
    }
    // function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[25] calldata _pubSignals) public view returns (bool) 
    function ratingProduct(uint8 _star, string memory _productId, string memory _nullifier,  uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[25] calldata _pubSignals) public {
        bool proofValid = IVerifier(verifyContract).verifyProof(_pA, _pB, _pC, _pubSignals);
        require(proofValid, "Invalid proof");
        require(!nullifierUsed[_nullifier], "Nullifier already used");
        nullifierUsed[_nullifier] = true;

        require(_star >= 1 && _star <= 5, "Rating must be between 1 and 5 stars"); 

        totalRating[_productId] += _star; 
        ratingCount[_productId] += 1;

        currentRating[_productId] = _star;
        uint256 averageRating = totalRating[_productId] / ratingCount[_productId];
        emit NewRating(_productId, uint8(averageRating), ratingCount[_productId]);
    }

    function addNullifier(string memory _nullifier) public {
        nullifierUsed[_nullifier] = false;
    }

    // function getRatingProduct(string memory _productId) public view returns (uint256) {
    //     if (ratingCount[_productId] == 0) {
    //         return 0;
    //     }

    //     uint256 averageRating = totalRating[_productId] / ratingCount[_productId];
    //     return averageRating;
    // }

    function getRatingCount(string memory _productId) public view returns (uint256) {
        return ratingCount[_productId];
    }
}