const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicStreamingPlatform", function () {
  let AudioToken, audioToken, MusicStreamingPlatform, musicStreamingPlatform;
  let owner, artist, listener;

  const initialSupply = ethers.parseUnits("1000", 18); // 1000 AUDIO tokens with 18 decimals

  beforeEach(async function () {
    [owner, artist, listener] = await ethers.getSigners();

    // Deploy AudioToken contract
    AudioToken = await ethers.getContractFactory("AudioToken");
    audioToken = await AudioToken.deploy(initialSupply);
    await audioToken.waitForDeployment();

    // Deploy MusicStreamingPlatform contract
    MusicStreamingPlatform = await ethers.getContractFactory("MusicStreamingPlatform");
    musicStreamingPlatform = await MusicStreamingPlatform.deploy(await audioToken.getAddress());
    await musicStreamingPlatform.waitForDeployment();
  });

  it("should allow an artist to upload a song", async function () {
    const ipfsHash = "QmExampleIpfsHash"; // Example IPFS hash

    // Artist uploads a song
    await musicStreamingPlatform.connect(artist).uploadSong(ipfsHash);

    // Verify the song details
    const song = await musicStreamingPlatform.songs(0);
    expect(song.ipfsHash).to.equal(ipfsHash);
    expect(song.artist).to.equal(await artist.getAddress());
    expect(song.streamCount).to.equal(0);
    expect(song.exists).to.be.true;

    // Verify event emission
    await expect(musicStreamingPlatform.connect(artist).uploadSong("QmNewIpfsHash"))
      .to.emit(musicStreamingPlatform, "SongUploaded")
      .withArgs(1, await artist.getAddress(), "QmNewIpfsHash");
  });

  it("should allow a listener to stream a song and reward the artist and listener from contract funds", async function () {
    const ipfsHash = "QmExampleIpfsHash";

    // Artist uploads a song
    await musicStreamingPlatform.connect(artist).uploadSong(ipfsHash);

    // Fund the MusicStreamingPlatform with AUDIO tokens
    await audioToken.connect(owner).transfer(await musicStreamingPlatform.getAddress(), ethers.parseUnits("2", 18)); // Transfer 2 AUDIO tokens

    // Listener streams the song
    await expect(musicStreamingPlatform.connect(listener).streamSong(0))
        .to.emit(musicStreamingPlatform, "SongStreamed")
        .withArgs(0, await listener.getAddress(), await artist.getAddress());

    // Verify updated balances
    const artistBalance = await audioToken.balanceOf(await artist.getAddress());
    const listenerBalance = await audioToken.balanceOf(await listener.getAddress());

    expect(artistBalance).to.equal(ethers.parseUnits("1", 18)); // Artist received 1 AUDIO
    expect(listenerBalance).to.equal(ethers.parseUnits("1", 18)); // Listener received 1 AUDIO back

    // Verify stream count
    const song = await musicStreamingPlatform.songs(0);
    expect(song.streamCount).to.equal(1);
    });

  it("should retrieve song details", async function () {
    const ipfsHash = "QmExampleIpfsHash";

    // Artist uploads a song
    await musicStreamingPlatform.connect(artist).uploadSong(ipfsHash);

    // Retrieve song details
    const songDetails = await musicStreamingPlatform.getSongDetails(0);
    expect(songDetails.ipfsHash).to.equal(ipfsHash);
    expect(songDetails.artist).to.equal(await artist.getAddress());
    expect(songDetails.streamCount).to.equal(0);
  });
});
