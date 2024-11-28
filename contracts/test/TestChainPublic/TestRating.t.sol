// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/ChainPublic/Rating.sol";

contract RatingTest is Test {
    Rating private rating;

    function setUp() public {
        rating = new Rating();
    }

    function testInitialRatingIsZero() public {
        uint256 initialRating = rating.getRatingProduct("product1");
        assertEq(initialRating, 0, "Initial rating should be 0");
    }

    function testRateProductWithValidStars() public {
        rating.ratingProduct(4, "product1");
        uint256 ratingValue = rating.getRatingProduct("product1");
        uint256 count = rating.getRatingCount("product1");

        assertEq(ratingValue, 4, "Rating should be 4");
        assertEq(count, 1, "Rating count should be 1");
    }

    function testRateMultipleTimesAndCheckAverage() public {
        rating.ratingProduct(3, "product1");
        rating.ratingProduct(5, "product1");

        uint256 averageRating = rating.getRatingProduct("product1");
        uint256 count = rating.getRatingCount("product1");

        assertEq(averageRating, 4, "Average rating should be 4"); // (3+5)/2 = 4
        assertEq(count, 2, "Rating count should be 2");
    }

    function testInvalidRatingReverts() public {
        vm.expectRevert(bytes("Rating must be between 1 and 5 stars"));
        rating.ratingProduct(6, "product1");

        vm.expectRevert(bytes("Rating must be between 1 and 5 stars"));
        rating.ratingProduct(0, "product1");
    }
}
