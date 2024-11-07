// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    address public admin;

    constructor() ERC721("Music NFT", "MNFT") Ownable(msg.sender) {
        admin = msg.sender;
    }

    function mintNFT(string memory tokenURI) external returns (uint256) {
        uint256 tokenId = nextTokenId; // Capture the current tokenId
        _safeMint(msg.sender, tokenId); // Mint the NFT
        _setTokenURI(tokenId, tokenURI); // Set the metadata URI for the NFT
        nextTokenId++; // Increment the next tokenId for future mints
        
        return tokenId; // Return the minted tokenId
    }
}

