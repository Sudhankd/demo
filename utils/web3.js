import Web3 from 'web3';
import MusicStreamingPlatformABI from '../artifacts/contracts/MusicStreamingPlatform.sol/MusicStreamingPlatform.json'; // Adjust the path as necessary
import AudioTokenABI from '../artifacts/contracts/AudioToken.sol/AudioToken.json'; // Adjust the path as necessary
import MusicNFTABI from '../artifacts/contracts/MusicNFT.sol/MusicNFT.json'; // Adjust the path as necessary
import MarketplaceABI from '../artifacts/contracts/Marketplace.sol/Marketplace.json'; // Adjust the path as necessary

const CONTRACT_ADDRESSES = {
    musicStreamingPlatform: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    audioToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    musicNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

let web3;
let musicStreamingPlatformContract;
let audioTokenContract;
let musicNFTContract;
let marketplaceContract;

export const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize all the contracts
        musicStreamingPlatformContract = new web3.eth.Contract(MusicStreamingPlatformABI.abi, CONTRACT_ADDRESSES.musicStreamingPlatform);
        audioTokenContract = new web3.eth.Contract(AudioTokenABI.abi, CONTRACT_ADDRESSES.audioToken);
        musicNFTContract = new web3.eth.Contract(MusicNFTABI.abi, CONTRACT_ADDRESSES.musicNFT);
        marketplaceContract = new web3.eth.Contract(MarketplaceABI.abi, CONTRACT_ADDRESSES.marketplace);
    }
    else
    {
        console.log("hi");
    }
};

// Music Streaming Platform Functions
export const uploadSong = async (ipfsHash) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    const tx = await musicStreamingPlatformContract.methods.uploadSong(ipfsHash).send({ from: accounts[0] });
    musicStreamingPlatformContract.events.SongUploaded({}, (error, event) => {
        if (error) {
            console.error("Error listening to SongUploaded event:", error);
        } else {
            console.log("Song uploaded successfully:", event);
            // Access event details, such as event.returnValues.tokenId, event.returnValues.artist, etc.
        }
    });
    return tx;
};

export const streamSong = async (tokenId) => {
    const accounts = await web3.eth.getAccounts();
    try {
        // Initiating the streamSong transaction
        const tx = await musicStreamingPlatformContract.methods.streamSong(tokenId).send({ from: accounts[0] });
        
        // Log the transaction details to the console for debugging
        console.log('Transaction successful:', tx);
        
        return tx; // Return the transaction object
    } catch (error) {
        // Handle any errors that occur during the transaction
        console.error('Error during streamSong transaction:', error);

        // You can throw the error again or return a custom error message
        throw new Error('Transaction failed. Please try again.');
    }
};


// New functions added to fetch song details and token ID counter
export const getSongDetails = async (tokenId) => {
    const songDetails = await musicStreamingPlatformContract.methods.getSongDetails(tokenId).call();
    return songDetails;
};

export const getTokenIdCounter = async () => {
    const tokenIdCounter = await musicStreamingPlatformContract.methods.getTokenIdCounter().call();
    return tokenIdCounter;
};

// Audio Token Functions
export const getAudioTokenBalance = async () => {
    const accounts = await web3.eth.getAccounts();
    const balance = await audioTokenContract.methods.balanceOf(accounts[0]).call();
    return balance;
};

export const transferAudioToken = async (to, amount) => {
    const accounts = await web3.eth.getAccounts();
    const tx = await audioTokenContract.methods.transfer(to, amount).send({ from: accounts[0] });
    return tx;
};

export const listNFTForSale = async (nftId, price) => {
    const accounts = await web3.eth.getAccounts();
    const tx = await marketplaceContract.methods.listNFT(nftId, price).send({ from: accounts[0] });
    return tx;
};

// Music NFT Functions
export const mintMusicNFT = async (tokenURI) => {
    const accounts = await web3.eth.getAccounts();
    // Mint the NFT first
    const tx = await musicNFTContract.methods.mintNFT(accounts[0], tokenURI).send({ from: accounts[0] });
    
    const tokenId = tx.events.Transfer.returnValues.tokenId;

    // List the NFT on the marketplace with the price
    return tokenId; 
};

// 2. Approve Marketplace Contract to transfer NFT
export const approveNFT = async (tokenId) => {
    const accounts = await web3.eth.getAccounts();

    try {
        // Approve the marketplace contract to transfer the NFT
        await musicNFTContract.methods
            .approve(marketplaceContract.options.address, tokenId)
            .send({ from: accounts[0] });
        console.log(`Marketplace approved for NFT ${tokenId}`);
    } catch (err) {
        console.error('Approval failed:', err);
        throw new Error('Approval failed. Please try again.');
    }
};

export const getMusicNFTDetails = async (tokenId) => {
    const details = await musicNFTContract.methods.tokenURI(tokenId).call();
    return details;
};

// Marketplace Function
// Marketplace Function to Purchase NFT
export const purchaseNFT = async (nftId) => {
    const accounts = await web3.eth.getAccounts();
    try {
        const tx = await marketplaceContract.methods.buyNFT(nftId).send({ from: accounts[0] });
        console.log("NFT purchased successfully:", tx);
        return tx; // You can return the transaction details if needed
    } catch (err) {
        console.error("Error purchasing NFT:", err);
        throw new Error('Failed to purchase NFT. Please try again.');
    }
};


// web3.js: Add the function to get all listings from the marketplace contract
export const getAllListings = async () => {
    try {
        const listings = await marketplaceContract.methods.getAllListings().call();
        return listings;
    } catch (err) {
        console.error('Error fetching listings:', err);
        throw new Error('Failed to fetch listings. Please try again.');
    }
};


// Add more functions as needed for the other contract functions

export { 
    web3, 
    musicStreamingPlatformContract, 
    audioTokenContract, 
    musicNFTContract, 
    marketplaceContract 
};
