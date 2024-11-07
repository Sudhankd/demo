// scripts/deploy.js
import hre from 'hardhat';

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy AudioToken contract
    const AudioToken = await hre.ethers.getContractFactory("AudioToken");
    const audioToken = await AudioToken.deploy();
    await audioToken.waitForDeployment();
    console.log("AudioToken deployed to:", await audioToken.getAddress());

    // Deploy MusicNFT contract
    const MusicNFT = await hre.ethers.getContractFactory("MusicNFT");
    const musicNFT = await MusicNFT.deploy();
    await musicNFT.waitForDeployment();
    console.log("MusicNFT deployed to:", await musicNFT.getAddress());

    // Deploy Marketplace contract
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(await audioToken.getAddress(), await musicNFT.getAddress());
    await marketplace.waitForDeployment();
    console.log("Marketplace deployed to:",await marketplace.getAddress());

    // Deploy MusicStreamingPlatform contract
    const MusicStreamingPlatform = await hre.ethers.getContractFactory("MusicStreamingPlatform");
    const musicStreamingPlatform = await MusicStreamingPlatform.deploy(await audioToken.getAddress());
    await musicStreamingPlatform.waitForDeployment();
    console.log("MusicStreamingPlatform deployed to:", await musicStreamingPlatform.getAddress());
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
