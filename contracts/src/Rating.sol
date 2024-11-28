// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Rating {

    mapping(string => uint256) private totalRating; 
    mapping(string => uint256) private ratingCount; 
    mapping(string => uint8) public currentRating; 

    function ratingProduct(uint8 _star, string memory _productId) public {
        require(_star >= 1 && _star <= 5, "Rating must be between 1 and 5 stars"); 

        totalRating[_productId] += _star; 
        ratingCount[_productId] += 1;

        currentRating[_productId] = _star;
    }

    function getRatingProduct(string memory _productId) public view returns (uint256) {
        if (ratingCount[_productId] == 0) {
            return 0;
        }

        uint256 averageRating = totalRating[_productId] / ratingCount[_productId];
        return averageRating;
    }

    function getRatingCount(string memory _productId) public view returns (uint256) {
        return ratingCount[_productId];
    }
}
