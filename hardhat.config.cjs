require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.20", // More stable version
    networks: {
        hardhat: {
            chainId: 1337
        },
        // Add other networks as needed
        // sepolia: {
        //     url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        //     accounts: [process.env.PRIVATE_KEY]
        // }
    },
    paths: {
        artifacts: './artifacts',
    },
};