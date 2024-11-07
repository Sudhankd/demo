const { expect } = require("chai");
const { parseUnits } = require("ethers");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

describe("Music Marketplace", function () {
  let AudioToken, MusicNFT, Marketplace;
  let audioToken, musicNFT, marketplace;
  let owner, artist, buyer;

  beforeEach(async () => {
    [owner, artist, buyer] = await ethers.getSigners();

    // Deploy AUDIO Token
    AudioToken = await ethers.getContractFactory("AudioToken");
    audioToken = await AudioToken.deploy(parseUnits("1000")); // 1 million tokens
    await audioToken.waitForDeployment();

    // Deploy Music NFT Contract
    MusicNFT = await ethers.getContractFactory("MusicNFT");
    musicNFT = await MusicNFT.deploy();
    await musicNFT.waitForDeployment();

    // Deploy Marketplace Contract
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      await audioToken.getAddress(),
      await musicNFT.getAddress()
    );
    await marketplace.waitForDeployment();

    // Distribute AUDIO tokens to the buyer
    await audioToken.transfer(await buyer.getAddress(), parseUnits("100"));
  });

  it("should allow an artist to mint an NFT", async function () {
    await musicNFT.connect(artist).mintNFT("ipfs://sample-music-metadata");
    expect(await musicNFT.ownerOf(0)).to.equal(await artist.getAddress());
  });

  it("should allow an artist to list an NFT on the marketplace", async function () {
    // Artist mints an NFT
    await musicNFT.connect(artist).mintNFT("ipfs://sample-music-metadata");
    
    // Approve marketplace to transfer NFT
    await musicNFT.connect(artist).approve(await marketplace.getAddress(), 0);
    
    // List NFT for sale on the marketplace
    const price = parseEther("50"); // 50 AUDIO tokens
    await marketplace.connect(artist).listNFT(0, price);
    
    const listing = await marketplace.listings(0);
    expect(listing.seller).to.equal(artist.address);
    expect(listing.price.toString()).to.equal(price.toString());
  });

  it("should allow a buyer to purchase an NFT", async function () {
    // Artist mints and lists NFT
    await musicNFT.connect(artist).mintNFT("ipfs://sample-music-metadata");
    await musicNFT.connect(artist).approve(await marketplace.getAddress(), 0);
    const price = parseUnits("20");
    await marketplace.connect(artist).listNFT(0, price);

    // Buyer approves marketplace to spend AUDIO tokens
    await audioToken.connect(buyer).approve(await marketplace.getAddress(), price);

    // Buyer buys the NFT
    await marketplace.connect(buyer).buyNFT(0);

    // Verify NFT ownership transferred to buyer
    expect(await musicNFT.ownerOf(0)).to.equal(await buyer.getAddress());

    // Verify payment transferred to artist
    expect(await audioToken.balanceOf(await artist.getAddress())).to.equal(price);
  });

  it("should allow an artist to cancel a listing", async function () {
    // Artist mints and lists NFT
    await musicNFT.connect(artist).mintNFT("ipfs://sample-music-metadata");
    await musicNFT.connect(artist).approve(await marketplace.getAddress(), 0);
    const price = parseEther("50");
    await marketplace.connect(artist).listNFT(0, price);

    // Artist cancels the listing
    await marketplace.connect(artist).cancelListing(0);

    // Verify NFT ownership is back with the artist
    expect(await musicNFT.ownerOf(0)).to.equal(artist.address);
  });
});