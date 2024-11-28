// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./SellerComerce.sol";
import "./UserComerce.sol";

contract DealComerce is SellerComerce, UserComerce {

    event DealCreated(uint dealId, address buyer, uint productId, uint amount, uint value);
    event DealConfirmed(uint dealId);
    event DealCompleted(uint dealId, uint amount);

    struct Deal {
        address buyer;
        address seller;
        uint productId;
        uint amount;
        uint value; 
        bool buyerConfirmed;
        bool sellerConfirmed;
        bool isCompleted;
    }

    uint public dealId;
    mapping(uint => Deal) public deals;
    mapping(address => uint[]) public buyerDeals;


    function createDeal(uint _productId, uint _amount) public payable {
        require(quantityPerItem[sellers[msg.sender].idTypeItems[_productId]] >= _amount, "Not enough stock");
        require(msg.value > 0, "Must send ETH to create deal");

        uint _dealId = dealId++;
        deals[_dealId] = Deal({
            buyer: msg.sender,
            seller: address(0), 
            productId: _productId,
            amount: _amount,
            value: msg.value,
            buyerConfirmed: false,
            sellerConfirmed: false,
            isCompleted: false
        });

        buyerDeals[msg.sender].push(_dealId);
        emit DealCreated(_dealId, msg.sender, _productId, _amount, msg.value);
    }

    function confirmSellerDeal(uint _dealId) public {
        require(deals[_dealId].seller == address(0), "Seller already confirmed");
        require(deals[_dealId].buyer != msg.sender, "You cannot be both buyer and seller");
        require(bytes(sellers[msg.sender].idTypeItems[deals[_dealId].productId]).length > 0, "Seller does not have this product");

        deals[_dealId].seller = msg.sender;
        deals[_dealId].sellerConfirmed = true;
        emit DealConfirmed(_dealId);
    }


    function completeDeal(uint _dealId) public {
        require(deals[_dealId].buyer == msg.sender, "You are not the buyer");
        require(deals[_dealId].buyerConfirmed == false, "Deal already confirmed by buyer");
        require(deals[_dealId].sellerConfirmed == true, "Seller has not confirmed the deal");
        require(!deals[_dealId].isCompleted, "Deal already completed");

        deals[_dealId].buyerConfirmed = true;
        deals[_dealId].isCompleted = true;


        payable(deals[_dealId].seller).transfer(deals[_dealId].value);


        quantityPerItem[sellers[deals[_dealId].seller].idTypeItems[deals[_dealId].productId]] -= deals[_dealId].amount;

        emit DealCompleted(_dealId, deals[_dealId].value);
    }
}
