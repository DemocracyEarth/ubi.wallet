import type { Contract } from "@/lib/types"

// Mock AI function to generate a contract from natural language
export async function mockGenerateContract(prompt: string): Promise<Contract> {
  // In a real implementation, this would call an AI service like OpenAI
  return new Promise((resolve) => {
    setTimeout(() => {
      let code = ""
      let description = ""

      // Generate different contracts based on keywords in the prompt
      if (prompt.toLowerCase().includes("token") || prompt.toLowerCase().includes("erc20")) {
        description = "A standard ERC-20 token contract with customizable supply and token details."
        code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UBIToken is ERC20, Ownable {
    uint256 private _cap;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 cap_
    ) ERC20(name, symbol) {
        require(cap_ > 0, "ERC20Capped: cap is 0");
        require(initialSupply <= cap_, "ERC20Capped: initial supply exceeds cap");
        _cap = cap_;
        _mint(msg.sender, initialSupply);
    }
    
    function cap() public view returns (uint256) {
        return _cap;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
    
    function burnFrom(address account, uint256 amount) public {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, msg.sender, currentAllowance - amount);
        }
        _burn(account, amount);
    }
}`
      } else if (prompt.toLowerCase().includes("nft") || prompt.toLowerCase().includes("erc721")) {
        description = "An ERC-721 NFT collection contract with minting and metadata functionality."
        code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UBICollection is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIdCounter;
    
    string private _baseTokenURI;
    uint256 public maxSupply;
    uint256 public mintPrice;
    bool public mintingEnabled = false;
    
    mapping(uint256 => string) private _tokenURIs;
    
    event MintingEnabled(bool enabled);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) ERC721(name, symbol) {
        _baseTokenURI = baseURI;
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
    }
    
    function mint() public payable {
        require(mintingEnabled, "Minting is not enabled");
        require(totalSupply() < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
    
    function mintForAddress(address recipient) public onlyOwner {
        require(totalSupply() < maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(recipient, tokenId);
    }
    
    function setMintingEnabled(bool enabled) public onlyOwner {
        mintingEnabled = enabled;
        emit MintingEnabled(enabled);
    }
    
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }
        
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}`
      } else if (prompt.toLowerCase().includes("dao") || prompt.toLowerCase().includes("governance")) {
        description = "A DAO governance contract with proposal creation, voting, and execution capabilities."
        code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GovernanceToken is ERC20Votes, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, initialSupply);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract UBIGovernance {
    using Counters for Counters.Counter;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    GovernanceToken public token;
    Counters.Counter public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    
    uint256 public votingDelay = 1; // blocks
    uint256 public votingPeriod = 10000; // blocks
    uint256 public proposalThreshold = 100 * 10**18; // 100 tokens
    
    event ProposalCreated(uint256 id, address proposer, string description, uint256 startBlock, uint256 endBlock);
    event VoteCast(address voter, uint256 proposalId, bool support, uint256 votes);
    event ProposalExecuted(uint256 id);
    event VotingDelaySet(uint256 newVotingDelay);
    event VotingPeriodSet(uint256 newVotingPeriod);
    event ProposalThresholdSet(uint256 newProposalThreshold);
    
    constructor(address _token) {
        token = GovernanceToken(_token);
    }
    
    function propose(string memory description) public returns (uint256) {
        require(token.balanceOf(msg.sender) >= proposalThreshold, "UBIGovernance: below proposal threshold");
        
        uint256 startBlock = block.number + votingDelay;
        uint256 endBlock = startBlock + votingPeriod;
        
        proposalCount.increment();
        uint256 proposalId = proposalCount.current();
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startBlock = startBlock;
        proposal.endBlock = endBlock;
        
        emit ProposalCreated(proposalId, msg.sender, description, startBlock, endBlock);
        
        return proposalId;
    }
    
    function castVote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.startBlock, "UBIGovernance: voting not started");
        require(block.number <= proposal.endBlock, "UBIGovernance: voting ended");
        require(!proposal.hasVoted[msg.sender], "UBIGovernance: already voted");
        
        uint256 votes = token.getPastVotes(msg.sender, proposal.startBlock - 1);
        require(votes > 0, "UBIGovernance: no voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit VoteCast(msg.sender, proposalId, support, votes);
    }
    
    function execute(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "UBIGovernance: voting not ended");
        require(!proposal.executed, "UBIGovernance: already executed");
        require(proposal.forVotes > proposal.againstVotes, "UBIGovernance: proposal rejected");
        
        proposal.executed = true;
        
        // Execute the proposal logic here
        // This would typically call an external contract or function
        
        emit ProposalExecuted(proposalId);
    }
    
    function setVotingDelay(uint256 newVotingDelay) public {
        // In a real contract, this would be restricted to governance
        votingDelay = newVotingDelay;
        emit VotingDelaySet(newVotingDelay);
    }
    
    function setVotingPeriod(uint256 newVotingPeriod) public {
        // In a real contract, this would be restricted to governance
        votingPeriod = newVotingPeriod;
        emit VotingPeriodSet(newVotingPeriod);
    }
    
    function setProposalThreshold(uint256 newProposalThreshold) public {
        // In a real contract, this would be restricted to governance
        proposalThreshold = newProposalThreshold;
        emit ProposalThresholdSet(newProposalThreshold);
    }
}`
      } else {
        // Default to a simple contract
        description = "A smart contract based on your description."
        code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomContract {
    address public owner;
    string public name;
    uint256 public value;
    
    event ValueChanged(uint256 newValue);
    
    constructor(string memory _name) {
        owner = msg.sender;
        name = _name;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function setValue(uint256 _value) public onlyOwner {
        value = _value;
        emit ValueChanged(_value);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}`
      }

      resolve({
        id: Date.now().toString(),
        prompt,
        description,
        code,
        createdAt: new Date(),
        name: "",
      })
    }, 1500) // Simulate API delay
  })
}

// In a real implementation, you would integrate with OpenAI or another LLM
// Example of how you might implement this with OpenAI:
/*
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function generateContract(prompt: string): Promise<Contract> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Convert this natural language contract description to Solidity code: "${prompt}"`,
    system: "You are a smart contract generator. Convert natural language descriptions into Solidity smart contracts."
  });

  // Parse the generated code
  const code = text;
  
  return {
    id: Date.now().toString(),
    prompt,
    description: `Smart contract based on: ${prompt}`,
    code,
    createdAt: new Date(),
    name: ""
  };
}
*/

