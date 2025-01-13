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
    mapping(uint  => string) public saveNullifier;
    mapping(string => bool) public nullifierUsed;



    function setVerifyContract(address _verifyContract) public {
        verifyContract = _verifyContract;
    }
    function ratingProduct(uint8 _star, string memory _productId, string memory _nullifier,  uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[25] calldata _pubSignals) public {
        bool proofValid = IVerifier(verifyContract).verifyProof(_pA, _pB, _pC, _pubSignals);
        require(proofValid, "Invalid proof");
        require(!nullifierUsed[_nullifier], "Nullifier already used");
        require(_star >= 1 && _star <= 5, "Rating must be between 1 and 5 stars"); 
        nullifierUsed[_nullifier] = true;
        totalRating[_productId] += _star; 
        ratingCount[_productId] += 1;
        currentRating[_productId] = _star;
        emit NewRating(_productId, _star, ratingCount[_productId]);
    }

    function addNullifier(string memory _nullifier, uint _dealId) public {
        saveNullifier[_dealId] = _nullifier;
        nullifierUsed[_nullifier] = false;
    }

    function getNullifierByDealId(uint _dealId) public view returns(string memory) {
        return saveNullifier[_dealId];
    }

    function getRatingCount(string memory _productId) public view returns (uint256) {
        return ratingCount[_productId];
    }
}