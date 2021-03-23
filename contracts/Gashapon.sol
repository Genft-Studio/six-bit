// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Gashapon is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    event TokenMinted(uint256 amountPaid, uint256 dna, address owner);
    event TokenBurned(uint256 amountRefunded, uint256 dna, address owner);

    uint256 public difficulty1Target;
    uint8 public dnaBitLength;
    string public cidRoot;
    uint256 public firstPrice;
    uint256 public priceIncrement;
    uint8 public burnRefundPercentage;
    address payable public artistAddress;

    struct Token {
        uint256 dna;
        string name;
        uint256 difficulty;
    }

    mapping(uint256 => uint256) byDna; // dna must be unique
    mapping(string => uint256) byName; // Token names must be unique

    Token[] public tokens;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _dnaBitLength,
        uint256 _firstPrice,
        uint256 _priceIncrement,
        uint8 _burnRefundPercentage,
        string memory _cidRoot
    ) public ERC721(_tokenName, _tokenSymbol) Ownable()
    {
        require(_burnRefundPercentage <= 100, "the burnRefundPercentage must be between 0 and 100");

        difficulty1Target = 2 ** (256 - uint256(_minimumDifficultyBits)) - 1;
        dnaBitLength = _dnaBitLength;
        firstPrice = _firstPrice;
        priceIncrement = _priceIncrement;
        burnRefundPercentage = _burnRefundPercentage;
        cidRoot = _cidRoot;
        artistAddress = payable(msg.sender);
    }

    function setArtistAddress(address payable newArtist_) public onlyOwner {
        artistAddress = newArtist_;
    }

    function mint(
        uint256 seed_,
        string memory name_,
        string memory tokenUri_
    ) payable public {
        uint256 newTokenIndex = tokens.length;

        uint price = _getMintPrice(newTokenIndex);
        require(msg.value >= price, 'not enough paid');
        require(!nameExists(name_), 'name must be unique');

        bytes32 work = keccak256(abi.encodePacked(msg.sender, symbol(), seed_));
        require(uint256(work) <= difficulty1Target, 'not enough work');

        uint256 change = msg.value.sub(price);
        artistAddress.transfer(msg.value.sub(change).sub(getBurnRefund()));
        msg.sender.transfer(change);

        uint256 dna = uint256(work) % 2 ** uint256(dnaBitLength);
        uint256 difficulty = uint256(difficulty1Target) / uint256(work);

        tokens.push(
            Token(dna, name_, difficulty)
        );
        byName[name_] = newTokenIndex;
        byDna[dna] = newTokenIndex;

        _safeMint(msg.sender, uint256(dna));
        _setTokenURI(newTokenIndex, tokenUri_);

        emit TokenMinted(price, dna, msg.sender);
    }

    function burn(uint256 dna_) public {
        address owner = ERC721.ownerOf(dna_);
        require(msg.sender == owner);

        uint256 burnRefund = _getBurnRefund(tokens.length);
        uint256 tokenIndex = byDna[dna_];
        Token memory token = tokens[tokenIndex];

        delete byName[token.name];
        delete byDna[dna_];
        delete tokens[tokenIndex];

        _burn(dna_);

        msg.sender.transfer(burnRefund);

        emit TokenBurned(burnRefund, dna_, owner);
    }

    // TODO is this needed?
    function getMintPrice() public view returns(uint256) {
        return _getMintPrice(tokens.length);
    }

    function _getMintPrice(uint256 tokenIndex_) private view returns(uint256) {
        return firstPrice.add(priceIncrement.mul(tokenIndex_));
    }

    // TODO is this needed?
    function getBurnRefund() public view returns(uint256) {
        return _getBurnRefund(tokens.length);
    }

    function _getBurnRefund(uint256 tokenIndex_) private view returns(uint256) {
        return firstPrice
            .add(priceIncrement.mul(tokenIndex_))
            .mul(burnRefundPercentage)
            .div(100);
    }

    function dnaExists(uint256 dna_) public view returns (bool) {
        return byDna[dna_] != 0;
    }

    function nameExists(string memory name_) public view returns (bool) {
        return byName[name_] != 0;
    }

    function getTokenURI(uint256 tokenId_) public view returns (string memory) {
        return tokenURI(tokenId_);
    }

    function getTokenOverview(uint256 tokenId_) public view returns (string memory, uint256, uint256)
    {
        uint256 tokenIndex = byDna[tokenId_];
        return (
            tokens[tokenIndex].name,
            tokens[tokenIndex].dna,
            tokens[tokenIndex].difficulty
        );
    }
}