// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;
// import "./DealComerce.sol";


// contract RatingComerce is DealComerce{
//     modifier canRating() {
//         require(isBought);
//         _;
//     }

//     function ratingProduct(address _seller, string memory _productId, uint8 _ratingProduct) public canRating(){
//         require(_ratingProduct >=1 && _ratingProduct <=5, "Only 1 to 5");
//         ratingPerTypeItems[_seller][_productId] = _ratingProduct;
//         uint totalRatings = 0;
//         uint numRatings = sellers[_seller].idTypeItems.length;
//         for (uint i = 0; i < numRatings; i++) {
//             string memory productId = sellers[_seller].idTypeItems[i];
//             totalRatings += ratingPerTypeItems[_seller][productId];
//         }
//         sellers[_seller].rating = uint8(totalRatings / numRatings);
//     }
// }