// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

// TODO: Explore Clone Factory Pattern for gas savings on main net release
//       https://betterprogramming.pub/learn-solidity-the-factory-pattern-75d11c3e7d29

import "./Gashapon.sol";

contract GashaponFactory {
    Gashapon[] public children;

    event GashaponCreated(address indexed _address);
    // event ChildCreated(address childAddress, uint data);

    function createChild(
//        string memory _tokenName,
//        string memory _tokenSymbol,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _dnaBitLength,
        uint256 _initialPrice,
        uint8 _priceIncreasePercentage
    ) external{
        Gashapon child = new Gashapon(
            _tokenName,
            _tokenSymbol,
            _minimumDifficultyBits,
            _dnaBitLength,
            _initialPrice,
            _priceIncreasePercentage
        );
        children.push(child);
        emit GashaponCreated(address(child));
    }

    // TODO: Check if it's necessary to declare this function (adapted from sample factory)
    //       or if a getter will be auto-generated in it's absence
    function getChildren() external view returns(Gashapon[] memory _children){
        _children = new Gashapon[](children.length);
        uint count;
        for(uint i=0;i<children.length; i++){
            _children[count] = children[i];
            count++;
        }
    }


}