// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Rating {

    event NewRating(string  _productId, uint8 _rating, uint256 _ratingCount);

    mapping(string => uint256) private totalRating; 
    mapping(string => uint256) private ratingCount; 
    mapping(string => uint8) public currentRating; 

    function ratingProduct(uint8 _star, string memory _productId) public {
        require(_star >= 1 && _star <= 5, "Rating must be between 1 and 5 stars"); 

        totalRating[_productId] += _star; 
        ratingCount[_productId] += 1;

        currentRating[_productId] = _star;
        uint256 averageRating = totalRating[_productId] / ratingCount[_productId];
        emit NewRating(_productId, uint8(averageRating), ratingCount[_productId]);
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