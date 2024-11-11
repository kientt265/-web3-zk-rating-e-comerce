// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
contract UserComerce{
    event NewUser(address _address);
    uint cerUserId = 10000;
    struct User {
        string  name;
        string email;
        uint8 age;
        uint cerId;
        address addressWallet;
    }

    mapping (address => User) public users;
    
    modifier LogIn(uint _cerId)  {
        require(users[msg.sender].cerId == _cerId);
        _;
    }

    function SignUp(string memory _name, uint8 _age, string memory _email) public {
        users[msg.sender] = User(_name, _email, _age, cerUserId , msg.sender);
        cerUserId++;
        emit NewUser(msg.sender);
    }


    
}