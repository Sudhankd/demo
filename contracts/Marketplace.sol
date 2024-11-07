// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    IERC20 public audioToken;
    IERC721 public musicNFT;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] private listedTokenIds; // Array to track active token IDs

    event Listed(uint256 tokenId, uint256 price, address seller);
    event Purchased(uint256 tokenId, uint256 price, address buyer);

    constructor(address _audioTokenAddress, address _musicNFTAddress) {
        audioToken = IERC20(_audioTokenAddress);
        musicNFT = IERC721(_musicNFTAddress);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(musicNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        musicNFT.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            tokenId: tokenId,
            price: price,
            seller: msg.sender
        });
        listedTokenIds.push(tokenId); // Add token ID to tracking array

        emit Listed(tokenId, price, msg.sender);
    }

    function buyNFT(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "NFT not for sale");

        console.log("pikachu");
        // Transfer AUDIO tokens from buyer to seller
        require(
            audioToken.transferFrom(msg.sender, listing.seller, listing.price),
            "Payment failed"
        );

        // Transfer NFT from contract to buyer
        musicNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId]; // Remove listing
        _removeTokenId(tokenId); // Remove token ID from tracking array

        emit Purchased(tokenId, listing.price, msg.sender);
    }

    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");

        musicNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];
        _removeTokenId(tokenId); // Remove token ID from tracking array
    }

    // Function to get all active listings
    function getAllListings() external view returns (Listing[] memory) {
        uint256 activeCount = listedTokenIds.length;
        Listing[] memory activeListings = new Listing[](activeCount);

        for (uint256 i = 0; i < activeCount; i++) {
            uint256 tokenId = listedTokenIds[i];
            Listing memory listing = listings[tokenId];
            activeListings[i] = listing;
            // console.log("Listing with tokenId:", tokenId, "and price:", listing.price);
        }
        
        return activeListings;
    }

    // Private helper function to remove a token ID from the array
    function _removeTokenId(uint256 tokenId) private {
        uint256 length = listedTokenIds.length;
        for (uint256 i = 0; i < length; i++) {
            if (listedTokenIds[i] == tokenId) {
                listedTokenIds[i] = listedTokenIds[length - 1];
                listedTokenIds.pop();
                break;
            }
        }
    }
}
