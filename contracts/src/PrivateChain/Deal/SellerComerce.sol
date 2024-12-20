// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SellerComerce {
    event NewProduct(string  _productID, uint _quantityPerItem, uint _pricePerProduct);
    mapping (address => Seller) public sellers;
    mapping (string => uint ) public quantityPerItem;
    mapping (string => uint) public pricePerProduct;
    mapping (string => address) public productBySeller;
    struct Seller{
        string shopName;
        string email;
        address addressWallet;
        string[] idTypeItems;
    }

    function createSeller(string memory _shopName, string memory _email) public {
        string[] memory emptyArray;
        sellers[msg.sender] = Seller(_shopName, _email, msg.sender, emptyArray);
    }

    function uploadItems(string memory _productID, uint _quantityPerItem, uint _pricePerProduct) public {
        sellers[msg.sender].idTypeItems.push(_productID);
        quantityPerItem[_productID] = _quantityPerItem;
        productBySeller[_productID] = msg.sender;
        pricePerProduct[_productID] = _pricePerProduct;
        emit NewProduct(_productID, _quantityPerItem, _pricePerProduct);
    }

    function getDetailProduct(string memory _productID) public view returns(uint, uint) {
        return (quantityPerItem[_productID], pricePerProduct[_productID] );
    }

}