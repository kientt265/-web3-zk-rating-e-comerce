// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./SellerComerce.sol";
import "./UserComerce.sol";

contract DealComerce is SellerComerce, UserComerce {

    event DealCreated(uint dealId, address buyer, string productId, uint amount, uint value);
    event DealConfirmed(uint dealId);
    event DealCompleted(uint dealId, uint amount, address buyer);

    struct Deal {
        address buyer;
        address seller;
        string productId;
        uint amount;
        uint value; 
        bool buyerConfirmed;
        bool isCompleted;
    }

    uint public dealId = 0;
    mapping (address => uint) public getDealIDByAddress;
    mapping(uint => Deal) public deals;
    mapping(address => uint[]) public buyerDeals;

    modifier onlyUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    function createDeal(string memory _productId, uint _amount) public payable onlyUser {
        require(quantityPerItem[_productId] >= _amount, "Not enough stock");
        require(msg.value == pricePerProduct[_productId]*_amount, "Must send ETH to create deal");

        uint _dealId = dealId++;
        deals[_dealId] = Deal({
            buyer: msg.sender,
            seller: productBySeller[_productId], 
            productId: _productId,
            amount: _amount,
            value: msg.value,
            buyerConfirmed: false,
            isCompleted: false
        });
        quantityPerItem[_productId] -= _amount;
        buyerDeals[msg.sender].push(_dealId);
        getDealIDByAddress[msg.sender] = _dealId;
        emit DealCreated(_dealId, msg.sender, _productId, _amount, msg.value);
    }




    function completeDeal(uint _dealId) public {
        require(deals[_dealId].buyer == msg.sender, "You are not the buyer");
        require(deals[_dealId].buyerConfirmed == false, "Deal already confirmed by buyer");
        require(!deals[_dealId].isCompleted, "Deal already completed");

        deals[_dealId].buyerConfirmed = true;
        deals[_dealId].isCompleted = true;


        payable(deals[_dealId].seller).transfer(deals[_dealId].value);


        emit DealCompleted(_dealId, deals[_dealId].value, msg.sender);
    }

    function getDealId(address _addressUser) public view returns(uint) {
        return getDealIDByAddress[_addressUser];
    }
}
