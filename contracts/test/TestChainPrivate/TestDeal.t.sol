// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/PrivateChain/Deal/DealComerce.sol";

contract TestDealComerce is Test {
    DealComerce dealComerce;
    
    address buyer = address(0x1);
    address seller = address(0x2);
    string productId = "product1";
    uint amount = 10;
    uint pricePerProduct = 0.1 ether; // Giá mỗi sản phẩm là 0.1 ETH

    function setUp() public {
        dealComerce = new DealComerce();

        // Set up a seller
        vm.prank(seller);
        dealComerce.createSeller("Shop A", "shopA@example.com");
        dealComerce.uploadItems(productId, 100, pricePerProduct);
        
        // Set up a user
        vm.prank(buyer);
        dealComerce.SignUp("Buyer A", 30, "buyerA@example.com");
    }

    function testCreateDeal() public {
        // Deal ETH to buyer address before creating deal
        vm.deal(buyer, 10 ether);
        
        uint totalPrice = pricePerProduct * amount; // Tính tổng giá trị giao dịch
        
        vm.prank(buyer);
        dealComerce.createDeal{value: totalPrice}(productId, amount);

        // Check if the deal was created
        uint dealID = dealComerce.getDealId(buyer);
        (
            address dealBuyer,
            address dealSeller,
            string memory dealProductId,
            uint dealAmount,
            uint dealValue,
            bool buyerConfirmed,
            bool isCompleted
        ) = dealComerce.deals(dealID);

        assertEq(dealBuyer, buyer);
        assertEq(dealSeller, seller);
        assertEq(dealProductId, productId);
        assertEq(dealAmount, amount);
        assertEq(dealValue, totalPrice);
        assertFalse(buyerConfirmed);
        assertFalse(isCompleted);
    }

    function testCompleteDeal() public {
        // Deal ETH to buyer address
        vm.deal(buyer, 10 ether);
        
        uint totalPrice = pricePerProduct * amount;
        
        // First create a deal
        vm.prank(buyer);
        dealComerce.createDeal{value: totalPrice}(productId, amount);
        
        uint dealID = dealComerce.getDealId(buyer);

        // Get seller's initial balance
        uint256 initialSellerBalance = seller.balance;

        // Complete the deal
        vm.prank(buyer);
        dealComerce.completeDeal(dealID);

        // Check if the deal is completed
        (,,,,,bool buyerConfirmed, bool isCompleted) = dealComerce.deals(dealID);
        assertTrue(buyerConfirmed);
        assertTrue(isCompleted);

        // Check if seller received the payment
        assertEq(seller.balance, initialSellerBalance + totalPrice);
    }

    function testFailCompleteDealNotBuyer() public {
        // Deal ETH to buyer address
        vm.deal(buyer, 10 ether);
        
        uint totalPrice = pricePerProduct * amount;
        
        // First create a deal
        vm.prank(buyer);
        dealComerce.createDeal{value: totalPrice}(productId, amount);
        
        uint dealID = dealComerce.getDealId(buyer);

        // Try to complete the deal as seller (should fail)
        vm.prank(seller);
        dealComerce.completeDeal(dealID);
    }
}
