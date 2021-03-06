// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

// TODO: Explore Clone Factory Pattern for gas savings on main net release
//       https://betterprogramming.pub/learn-solidity-the-factory-pattern-75d11c3e7d29

import "./Gashapon.sol";

contract GashaponFactory {
    Gashapon[] public children;

    event GashaponCreated(address indexed _from, address indexed _child);
    // event ChildCreated(address childAddress, uint data);

    // TODO: Add field for IPFS path to data files

    function createChild(
        string calldata _tokenName,
        string calldata _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _dnaBitLength,
        uint256 _firstPrice,
        uint256 _priceIncrement,
        uint8 _burnRefundPercentage,
        string calldata _cidRoot
    ) external {
        Gashapon child = new Gashapon(
            _tokenName,
            _tokenSymbol,
            _minimumDifficultyBits,
            _dnaBitLength,
            _firstPrice,
            _priceIncrement,
            _burnRefundPercentage,
            _cidRoot
        );
        children.push(child);
        emit GashaponCreated(msg.sender, address(child));
        // Set the caller of this factory to the owner of the new child contract
        child.setArtistAddress(msg.sender);
    }

    // TODO: Check if it's necessary to declare this function (adapted from sample factory)
    //       or if a getter will be auto-generated in it's absence
    function getChildren() external view returns (Gashapon[] memory _children){
        _children = new Gashapon[](children.length);
        uint count;
        for (uint i = 0; i < children.length; i++) {
            _children[count] = children[i];
            count++;
        }
    }


}