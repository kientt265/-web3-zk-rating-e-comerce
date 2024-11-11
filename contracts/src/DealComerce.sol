// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./SellerComerce.sol";
import "./UserComerce.sol";

contract DealComerce is SellerComerce, UserComerce {

    event DealCreated(uint dealId, address buyer, uint productId, uint amount);
    event DealConfirmed(uint dealId);
    event DealCompleted(uint dealId);

    struct Deal {
        address buyer;  
        uint productId;   
        uint amount;    
        bool buyerConfirmed;  
        bool sellerConfirmed;    
        bool isCompleted;      
    }

    bool public isBought;
    uint public dealId; 
    mapping (uint => Deal) public deals;
    mapping (address => uint[]) public buyerDeals; 


    function createDeal(uint _productId, uint _amount) public {
        require(quantityPerItem[sellers[msg.sender].idTypeItems[_productId]] >= _amount, "Not enough stock");

        uint _dealId = dealId++;  
        deals[_dealId] = Deal({
            buyer: msg.sender,
            productId: _productId,
            amount: _amount,
            buyerConfirmed: false,
            sellerConfirmed: false,
            isCompleted: false
        });

        buyerDeals[msg.sender].push(_dealId);  
        emit DealCreated(_dealId, msg.sender, _productId, _amount);
    }

    //Confirm from buyer
    function confirmBuyerDeal(uint _dealId) public {
        require(deals[_dealId].buyer == msg.sender, "You are not the buyer");
        require(!deals[_dealId].buyerConfirmed, "Deal already confirmed by buyer");
        
        deals[_dealId].buyerConfirmed = true;
        emit DealConfirmed(_dealId);
    }

    //Confirm form seller
    function confirmSellerDeal(uint _dealId) public {
        require(deals[_dealId].buyer != msg.sender, "You cannot be the seller and buyer at the same time");
        require(bytes(sellers[msg.sender].idTypeItems[deals[_dealId].productId]).length > 0, "Seller does not have this product");
        require(!deals[_dealId].sellerConfirmed, "Deal already confirmed by seller");

        deals[_dealId].sellerConfirmed = true;
        emit DealConfirmed(_dealId);
    }

    // Complete transfer
    function completeDeal(uint _dealId) public {
        require(deals[_dealId].buyerConfirmed, "Buyer has not confirmed the deal");
        require(deals[_dealId].sellerConfirmed, "Seller has not confirmed the deal");
        require(!deals[_dealId].isCompleted, "Deal already completed");

    
        deals[_dealId].isCompleted = true;
        emit DealCompleted(_dealId);

        isBought = true;
        quantityPerItem[sellers[deals[_dealId].buyer].idTypeItems[deals[_dealId].productId]] -= deals[_dealId].amount;
    }
}
