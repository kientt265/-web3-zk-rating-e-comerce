// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract Erc721 is ERC721URIStorage {
    

    constructor(string memory name, string memory symbol) ERC721(name, symbol){
        
    }



    function createProfile(uint256 _patientId, string memory _tokenURI) public {
        _safeMint(msg.sender, _patientId);
        _setTokenURI(_patientId, _tokenURI);
    }
}
