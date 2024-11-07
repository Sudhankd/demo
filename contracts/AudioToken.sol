// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AudioToken is ERC20 {
    address public contractOwner;

    constructor() ERC20("AUDIO", "AUDIO") {
        contractOwner = msg.sender; // Set the contract deployer as the owner
    }

    // Mint new AUDIO tokens (only callable by the contract owner)
    function mint(address admin, address to, uint256 amount) external {
        require(admin == contractOwner, "Not the contract owner");
        _mint(to, amount);
    }

    // Allow the owner to transfer ownership
    function transferOwnership(address newOwner) external {
        require(msg.sender == contractOwner, "Not the contract owner");
        contractOwner = newOwner;
    }
}
