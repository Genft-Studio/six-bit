// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Gashapon is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    uint256 public difficulty1Target;
    uint256 public totalDifficulty;
    uint8 public dnaBitLength;

    uint256 public nextPrice;
    uint8 priceIncreasePercentage;

    bytes32 public debug; // TODO remove me

    struct Token {
        bytes32 dna;
        string name;
        uint256 difficulty;
    }

    mapping(bytes32 => bool) byDna; // dna must be unique
    mapping(string => bool) byName; // Token names must be unique

    Token[] public tokens;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _dnaBitLength,
        uint256 _initialPrice,
        uint8 _priceIncreasePercentage
    ) public ERC721(_tokenName, _tokenSymbol)
    {
        // TODO set the starting price, the price escalation factor, artist commission
        difficulty1Target = 2 ** (256 - uint256(_minimumDifficultyBits)) - 1;
        dnaBitLength = _dnaBitLength;
        nextPrice = _initialPrice;
        priceIncreasePercentage = _priceIncreasePercentage;
    }

    function mint(
        uint256 _seed,
        string memory _name,
        string memory _tokenUri
    ) payable public returns (uint256) {
        require(msg.value >= nextPrice, 'not enough paid');

        // Increase the next price
        nextPrice = msg.value + (msg.value * priceIncreasePercentage / 100);

        // TODO verify that enough funds were submitted
        require(!nameExists(_name), 'name must be unique');

        bytes32 work = keccak256(abi.encode(msg.sender, symbol(), _seed));
        debug = work;  // TODO Remove me
        // FIXME require(uint256(work) <= difficulty1Target, 'not enough work');

        bytes32 dna = bytes32(uint256(work) % 2 ** uint256(dnaBitLength));
        uint256 difficulty = uint256(difficulty1Target) / uint256(work);

        totalDifficulty += difficulty;

        byName[_name] = true;
        byDna[dna] = true;

        uint256 newId = tokens.length;

        tokens.push(
            Token(dna, _name, difficulty)
        );
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, _tokenUri);

        return newId;
    }

    // TODO no transfer of unproven tokens

    // TODO burn to get price of last sold less artist commission

    function dnaExists(bytes32 _dna) public view returns (bool) {
        return uint256(_dna) != 0 && byDna[_dna];
    }

    function nameExists(string memory _name) public view returns (bool) {
        return bytes(_name).length != 0 && byName[_name];
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function getAverageDifficulty() public view returns (uint256) {
        return totalDifficulty / tokens.length;
    }

    function getTokenOverview(uint256 tokenId) public view returns (string memory, bytes32, uint256)
    {
        return (
        tokens[tokenId].name,
        tokens[tokenId].dna,
        tokens[tokenId].difficulty
        );
    }
}