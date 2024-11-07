// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockAudioToken is ERC20 {
    constructor() ERC20("Audio Token", "AUDIO") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to mint tokens to any address (for testing)
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Override transferFrom to always return true (for testing)
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        return true;
    }

    // Override transfer to always return true (for testing)
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        return true;
    }
}