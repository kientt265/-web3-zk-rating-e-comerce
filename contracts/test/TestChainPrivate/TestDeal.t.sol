// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/PrivateChain/Deal/DealComerce.sol";


contract TestDealComerce is Test {
    DealComerce dealComerce;
    SellerComerce sellerComerce;
    UserComerce userComerce;

    address buyer = address(0x1);
    address seller = address(0x2);
    uint productId = 1;
    uint amount = 10;

    function setUp() public {
        dealComerce = new DealComerce();
        sellerComerce = new SellerComerce();
        userComerce = new UserComerce();

        // Set up a seller
        vm.prank(seller);
        sellerComerce.createSeller("Shop A", "shopA@example.com");
        sellerComerce.uploadItems("itemHash1", 100);

        // Set up a user
        vm.prank(buyer);
        userComerce.SignUp("Buyer A", 30, "buyerA@example.com");
    }

    function testCreateDeal() public {
        vm.prank(buyer);
        dealComerce.createDeal{value: 1 ether}(productId, amount);

        // Check if the deal was created
        (address dealBuyer, address dealSeller, uint dealProductId, uint dealAmount, uint dealValue, bool buyerConfirmed, bool sellerConfirmed, bool isCompleted) = dealComerce.deals(0);
        assertEq(dealBuyer, buyer);
        assertEq(dealProductId, productId);
        assertEq(dealAmount, amount);
        assertEq(dealValue, 1 ether);
        assertFalse(buyerConfirmed);
        assertFalse(sellerConfirmed);
        assertFalse(isCompleted);
    }

    function testConfirmSellerDeal() public {
        vm.prank(buyer);
        dealComerce.createDeal{value: 1 ether}(productId, amount);

        vm.prank(seller);
        dealComerce.confirmSellerDeal(0);

        // Check if the seller is confirmed
        (,, , , , bool buyerConfirmed, bool sellerConfirmed,) = dealComerce.deals(0);
        assertTrue(sellerConfirmed);
        assertFalse(buyerConfirmed);
    }

    function testCompleteDeal() public {
        vm.prank(buyer);
        dealComerce.createDeal{value: 1 ether}(productId, amount);

        vm.prank(seller);
        dealComerce.confirmSellerDeal(0);

        vm.prank(buyer);
        dealComerce.completeDeal(0);

        // Check if the deal is completed
        (,, , , , bool buyerConfirmed, bool sellerConfirmed, bool isCompleted) = dealComerce.deals(0);
        assertTrue(buyerConfirmed);
        assertTrue(isCompleted);
    }
}
