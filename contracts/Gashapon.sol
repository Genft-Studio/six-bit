// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract Gashapon is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    string constant UNPROVEN_NAME = "<unproven>";

    bytes32 public difficulty1Target;
    uint256 public totalDifficulty;

    struct Toy {
        uint256 dna;
        string name;
        uint256 difficulty;
    }

    mapping(uint256 => bytes32) idToSecurityHash;
    mapping(uint256 => bool) byDna; // dna must be unique
    mapping(string => bool) byName; // Toy names must be unique

    Toy[] public toys;

    constructor(bytes32 _difficulty1Target) public ERC721("Gashapon", "TOY")
    {
        // TODO set the starting price, the price escalation factor, artist commission
        difficulty1Target = _difficulty1Target;
        totalDifficulty = 0;
    }

    function mintToy(bytes32 _securityHash) payable public returns (uint256) {
        // TODO verify that enough funds were submitted

        uint256 newId = toys.length;

        toys.push(
            Toy(0x0, UNPROVEN_NAME, 0)
        );
        idToSecurityHash[newId] = _securityHash;

        _safeMint(msg.sender, newId);

        return newId;
    }

    // TODO no transfer of unproven tokens

    // TODO burn to get price of last sold less artist commission

    function revealRarityProof(
        uint256 _id,
        uint256 _dna,
        bytes32 _proofOfWork,
        string memory _name,
        string memory _tokenUri
    ) public {
        require(
            _isApprovedOrOwner(_msgSender(), _id),
            "Proof provider is not owner"
        );

        require(!dnaExists(_dna), 'dna must be unique');
        require(!nameExists(_name), 'name must be unique');

        // Check the securityHash
        bytes32 securityHash = keccak256(abi.encodePacked(msg.sender, _proofOfWork));
        require(securityHash == idToSecurityHash[_id], "proof doesn't match the security hash");

        // Check for minimum work
        bytes32 work = keccak256(abi.encodePacked(_dna, _proofOfWork));
        require(work > difficulty1Target, "not enough work was applied");

        uint256 difficulty = uint256(difficulty1Target) / uint256(work);

        totalDifficulty += difficulty;

        byName[_name] = true;
        byDna[_dna] = true;

        toys[_id].name = _name;
        toys[_id].dna = _dna;
        toys[_id].difficulty = difficulty;
        _setTokenURI(_id, _tokenUri);
    }

    function dnaExists(uint256 _dna) public view returns (bool) {
        return _dna != 0 && byDna[_dna];
    }

    function nameExists(string memory _name) public view returns (bool) {
        return bytes(_name).length != 0 && byName[_name];
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function getNumberOfToys() public view returns (uint256) {
        return toys.length;
    }

    function getAverageDifficulty() public view returns (uint256) {
        return totalDifficulty / toys.length;
    }

    function getToyOverview(uint256 tokenId) public view returns (string memory, uint256, uint256)
    {
        return (
        toys[tokenId].name,
        toys[tokenId].dna,
        toys[tokenId].difficulty
        );
    }
}