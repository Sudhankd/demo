// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AudioToken.sol";  // Importing AudioToken.sol

contract MusicStreamingPlatform is ERC721, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    // AUDIO token contract instance
    AudioToken public audioToken;
    address public admin;

    struct Song {
        string ipfsHash;
        address artist;
        uint256 streamCount;
        uint256 tokenId;
        bool exists;
    }

    // Mapping from tokenId to Song
    mapping(uint256 => Song) public songs;

    // Mapping to track if an IPFS hash is already used
    mapping(string => bool) public ipfsHashUsed;

    // Events
    event SongUploaded(uint256 tokenId, address artist, string ipfsHash);
    event SongStreamed(uint256 tokenId, address listener, address artist);

    constructor(address _audioTokenAddress) ERC721("Music NFT", "MUSIC") {
        // Initialize the AudioToken instance
        audioToken = AudioToken(_audioTokenAddress);
        admin = msg.sender;
    }

    function uploadSong(string memory _ipfsHash) external {
        require(!ipfsHashUsed[_ipfsHash], "Song already exists");
        
        uint256 newTokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, newTokenId);

        songs[newTokenId] = Song({
            ipfsHash: _ipfsHash,
            artist: msg.sender,
            streamCount: 0,
            tokenId: newTokenId,
            exists: true
        });

        ipfsHashUsed[_ipfsHash] = true;

        emit SongUploaded(newTokenId, msg.sender, _ipfsHash);
    }

    function streamSong(uint256 _tokenId) external nonReentrant {
        require(songs[_tokenId].exists, "Song does not exist");
        console.log("hi");
        Song storage song = songs[_tokenId];
        
        // Mint 1 AUDIO to listener (mint to the listener)
        audioToken.mint(admin, msg.sender, 1 * (10 ** audioToken.decimals()));
        // Mint 1 AUDIO to artist (mint to the artist)
        audioToken.mint(admin, song.artist, 1 * (10 ** audioToken.decimals()));
        
        song.streamCount++;

        // Log the balances after minting
        // uint256 listenerBalance = audioToken.balanceOf(msg.sender);
        // uint256 artistBalance = audioToken.balanceOf(song.artist);

        // Use Hardhat's console.log to log the balances (this will show in the Hardhat console)
        console.log("king");
        // console.log("Listener's AUDIO token balance:", listenerBalance);
        // console.log("Artist's AUDIO token balance:", artistBalance);

        emit SongStreamed(_tokenId, msg.sender, song.artist);

    }

    // Getter for tokenIdCounter
    function getTokenIdCounter() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getSongDetails(uint256 _tokenId) external view returns (
        string memory ipfsHash,
        address artist,
        uint256 streamCount
    ) {
        require(songs[_tokenId].exists, "Song does not exist");
        Song memory song = songs[_tokenId];
        return (song.ipfsHash, song.artist, song.streamCount);
    }
}
