// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
contract UserComerce{
    event NewUser(address _address);
    struct User {
        string  name;
        string email;
        uint8 age;
        address addressWallet;
    }

    mapping (address => User) public users;
    


    function SignUp(string memory _name, uint8 _age, string memory _email) public {
        users[msg.sender] = User(_name, _email, _age , msg.sender);
        emit NewUser(msg.sender);
    }

}