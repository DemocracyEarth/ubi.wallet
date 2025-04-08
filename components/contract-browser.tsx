"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  BookmarkPlus,
  Bookmark,
  Star,
  ChevronDown,
  Code,
  FileCode,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Users,
  Clock,
  Shield,
  EyeOff,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Example contract data
interface ContractTemplate {
  id: string
  name: string
  description: string
  naturalLanguage: string
  category: string
  language: string
  code: string
  author: string
  stars: number
  deployments: number
  verified: boolean
  createdAt: Date
  tags: string[]
  framework: string
  securityScore: number
  complexity: "simple" | "moderate" | "complex"
  userCount: number
}

const exampleContracts: ContractTemplate[] = [
  {
    id: "1",
    name: "Basic UBI Token",
    description: "A standard ERC-20 token implementation with minting and burning capabilities.",
    naturalLanguage:
      "A token called 'Universal Basic Income' with the symbol 'UBI'. It has a fixed supply of 1 million tokens initially, but allows the owner to mint more tokens up to a maximum of 10 million. The token is transferable between users and allows users to burn their own tokens if they want to.",
    category: "token",
    language: "solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UBIToken is ERC20, Ownable {
    uint256 private _cap;
    
    constructor(uint256 initialSupply, uint256 cap_) ERC20("Universal Basic Income", "UBI") {
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
}`,
    author: "UBI Foundation",
    stars: 1245,
    deployments: 5678,
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    tags: ["token", "erc20", "ubi"],
    framework: "hardhat",
    securityScore: 95,
    complexity: "simple",
    userCount: 3240,
  },
  {
    id: "2",
    name: "Digital Citizens NFT",
    description: "An ERC-721 NFT collection with metadata and royalty support.",
    naturalLanguage:
      "An NFT collection called 'Digital Citizens' with a maximum of 10,000 unique items. Each NFT has properties for rarity, attributes, and an image URI. The creator receives 5% royalties on all secondary sales. Only the owner can mint new NFTs.",
    category: "nft",
    language: "solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DigitalCitizens is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    string private _baseTokenURI;
    uint256 public maxSupply = 10000;
    uint256 public royaltyPercentage = 5;
    
    constructor(string memory baseURI) ERC721("Digital Citizens", "DCTZEN") {
        _baseTokenURI = baseURI;
    }
    
    function mint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < maxSupply, "Max supply reached");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        return (owner(), (_salePrice * royaltyPercentage) / 100);
    }
}`,
    author: "Digital Collective",
    stars: 876,
    deployments: 2345,
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    tags: ["nft", "erc721", "collection"],
    framework: "hardhat",
    securityScore: 92,
    complexity: "moderate",
    userCount: 1876,
  },
  {
    id: "3",
    name: "Community Treasury",
    description: "A multi-signature wallet requiring multiple approvals for transactions.",
    naturalLanguage:
      "A wallet that requires 2 out of 3 designated addresses to approve any transaction. The wallet can hold tokens and NFTs. Any of the 3 owners can propose a transaction, but it only executes after getting the required approvals.",
    category: "wallet",
    language: "solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommunityTreasury {
    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
    }
    
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public required;
    
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved;
    
    constructor(address[] memory _owners, uint _required) {
        require(_owners.length > 0, "owners required");
        require(_required > 0 && _required <= _owners.length, "invalid required number of owners");
        
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        required = _required;
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    function submit(address _to, uint _value, bytes calldata _data) external onlyOwner {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false
        }));
        
        emit Submit(transactions.length - 1);
    }
    
    function approve(uint _txId) external onlyOwner txExists(_txId) notApproved(_txId) notExecuted(_txId) {
        approved[_txId][msg.sender] = true;
        emit Approve(msg.sender, _txId);
    }
    
    function execute(uint _txId) external txExists(_txId) notExecuted(_txId) {
        require(_getApprovalCount(_txId) >= required, "approvals < required");
        Transaction storage transaction = transactions[_txId];
        
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");
        
        emit Execute(_txId);
    }
    
    function revoke(uint _txId) external onlyOwner txExists(_txId) notExecuted(_txId) {
        require(approved[_txId][msg.sender], "tx not approved");
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender, _txId);
    }
    
    function _getApprovalCount(uint _txId) private view returns (uint count) {
        for (uint i = 0; i < owners.length; i++) {
            if (approved[_txId][owners[i]]) {
                count += 1;
            }
        }
    }
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }
    
    modifier txExists(uint _txId) {
        require(_txId < transactions.length, "tx does not exist");
        _;
    }
    
    modifier notApproved(uint _txId) {
        require(!approved[_txId][msg.sender], "tx already approved");
        _;
    }
    
    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "tx already executed");
        _;
    }
}`,
    author: "Community DAO",
    stars: 532,
    deployments: 987,
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    tags: ["wallet", "multisig", "security"],
    framework: "foundry",
    securityScore: 98,
    complexity: "complex",
    userCount: 756,
  },
  {
    id: "4",
    name: "Community Governance",
    description: "A DAO governance contract with proposal creation, voting, and execution.",
    naturalLanguage:
      "A governance system where people who hold at least 100 tokens can submit proposals. Each proposal has a description and a voting period of 3 days. Token holders can vote for or against proposals, with their voting power equal to the number of tokens they hold. If more than 50% of votes are in favor, the proposal passes.",
    category: "governance",
    language: "solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20Votes, Ownable {
    constructor() ERC20("Governance Token", "GOV") ERC20Permit("Governance Token") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract CommunityGovernance {
    struct Proposal {
        uint id;
        address proposer;
        string description;
        uint forVotes;
        uint againstVotes;
        uint startBlock;
        uint endBlock;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    GovernanceToken public token;
    uint public proposalCount;
    mapping(uint => Proposal) public proposals;
    uint public votingPeriod = 17280; // ~3 days in blocks
    uint public proposalThreshold = 100 * 10**18; // 100 tokens
    
    event ProposalCreated(uint id, address proposer, string description, uint startBlock, uint endBlock);
    event VoteCast(address voter, uint proposalId, bool support, uint votes);
    event ProposalExecuted(uint id);
    
    constructor(address _token) {
        token = GovernanceToken(_token);
    }
    
    function propose(string memory description) public returns (uint) {
        require(token.balanceOf(msg.sender) >= proposalThreshold, "Not enough tokens to propose");
        
        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startBlock = block.number;
        proposal.endBlock = block.number + votingPeriod;
        
        emit ProposalCreated(proposalCount, msg.sender, description, block.number, block.number + votingPeriod);
        
        return proposalCount;
    }
    
    function castVote(uint proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.startBlock, "Voting not started");
        require(block.number <= proposal.endBlock, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint votes = token.getPastVotes(msg.sender, proposal.startBlock - 1);
        require(votes > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit VoteCast(msg.sender, proposalId, support, votes);
    }
    
    function execute(uint proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        // Execute the proposal logic here
        
        emit ProposalExecuted(proposalId);
    }
}`,
    author: "Governance Labs",
    stars: 421,
    deployments: 156,
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    tags: ["dao", "governance", "voting"],
    framework: "hardhat",
    securityScore: 90,
    complexity: "complex",
    userCount: 432,
  },
  {
    id: "5",
    name: "Token Staking Rewards",
    description: "A staking contract where users can deposit tokens and earn rewards over time.",
    naturalLanguage:
      "A staking contract where users can deposit tokens and earn 5% APY in rewards. Users can withdraw their tokens at any time, but they only earn rewards after staking for at least 7 days. The owner can adjust the reward rate.",
    category: "defi",
    language: "solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenStakingRewards is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    uint public rewardRate = 5; // 5% APY
    uint public lockPeriod = 7 days;
    uint public lastUpdateTime;
    uint public rewardPerTokenStored;
    
    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards;
    mapping(address => uint) public balances;
    mapping(address => uint) public stakingTime;
    uint public totalSupply;
    
    event Staked(address indexed user, uint amount);
    event Withdrawn(address indexed user, uint amount);
    event RewardPaid(address indexed user, uint reward);
    
    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }
    
    function rewardPerToken() public view returns (uint) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / (365 days * totalSupply)
        );
    }
    
    function earned(address account) public view returns (uint) {
        if (block.timestamp < stakingTime[account] + lockPeriod) {
            return 0;
        }
        return (
            (balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18
        ) + rewards[account];
    }
    
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    
    function stake(uint amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        totalSupply += amount;
        balances[msg.sender] += amount;
        stakingTime[msg.sender] = block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        totalSupply -= amount;
        balances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    function getReward() external nonReentrant updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function setRewardRate(uint _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
    }
    
    function setLockPeriod(uint _lockPeriod) external onlyOwner {
        lockPeriod = _lockPeriod;
    }
}`,
    author: "DeFi Protocol",
    stars: 389,
    deployments: 432,
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    tags: ["defi", "staking", "rewards"],
    framework: "hardhat",
    securityScore: 88,
    complexity: "moderate",
    userCount: 1245,
  },
]

export function ContractBrowser() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("popular")
  const [savedContracts, setSavedContracts] = useState<string[]>([])
  const [expandedContract, setExpandedContract] = useState<string | null>(null)
  const [filteredContracts, setFilteredContracts] = useState(exampleContracts)
  const [showCode, setShowCode] = useState<Record<string, boolean>>({})

  // Filter contracts based on search, category, and sort
  useEffect(() => {
    let filtered = exampleContracts

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contract) =>
          contract.name.toLowerCase().includes(query) ||
          contract.description.toLowerCase().includes(query) ||
          contract.naturalLanguage.toLowerCase().includes(query) ||
          contract.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((contract) => contract.category === selectedCategory)
    }

    // Sort contracts
    if (sortOption === "popular") {
      filtered = [...filtered].sort((a, b) => b.stars - a.stars)
    } else if (sortOption === "newest") {
      filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortOption === "deployments") {
      filtered = [...filtered].sort((a, b) => b.deployments - a.deployments)
    } else if (sortOption === "security") {
      filtered = [...filtered].sort((a, b) => b.securityScore - a.securityScore)
    }

    setFilteredContracts(filtered)
  }, [searchQuery, selectedCategory, sortOption])

  const handleSaveContract = (contractId: string) => {
    if (savedContracts.includes(contractId)) {
      setSavedContracts((prev) => prev.filter((id) => id !== contractId))
      toast({
        title: "Contract Removed",
        description: "Contract removed from your saved list.",
        variant: "default",
      })
    } else {
      setSavedContracts((prev) => [...prev, contractId])
      toast({
        title: "Contract Saved",
        description: "Contract saved to your collection.",
        variant: "default",
      })
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied",
      description: "Contract code copied to clipboard.",
      variant: "default",
    })
  }

  const toggleShowCode = (contractId: string) => {
    setShowCode((prev) => ({
      ...prev,
      [contractId]: !prev[contractId],
    }))
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "token", label: "Tokens" },
    { value: "nft", label: "NFTs" },
    { value: "defi", label: "DeFi" },
    { value: "governance", label: "Governance" },
    { value: "wallet", label: "Wallets" },
  ]

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "1 day ago"
    } else if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? "month" : "months"} ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} ${years === 1 ? "year" : "years"} ago`
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900/80">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contracts by description or functionality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 pl-9"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-700 bg-gray-800">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>{categories.find((c) => c.value === selectedCategory)?.label || "Category"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className="cursor-pointer"
                  >
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-700 bg-gray-800">
                  <ChevronDown className="mr-2 h-4 w-4" />
                  <span>
                    {sortOption === "popular"
                      ? "Most Popular"
                      : sortOption === "newest"
                        ? "Newest First"
                        : sortOption === "deployments"
                          ? "Most Deployments"
                          : "Highest Security"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("popular")} className="cursor-pointer">
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("newest")} className="cursor-pointer">
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("deployments")} className="cursor-pointer">
                  Most Deployments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("security")} className="cursor-pointer">
                  Highest Security
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-4">
          {filteredContracts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No contracts found matching your search criteria</div>
          ) : (
            filteredContracts.map((contract) => (
              <Card
                key={contract.id}
                className={cn(
                  "p-4 bg-gray-800 border-gray-700 transition-all duration-200",
                  expandedContract === contract.id ? "mb-4" : "",
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contract.name}</h3>
                      {contract.verified && (
                        <Badge variant="outline" className="text-xs border-green-800 text-green-400">
                          Verified
                        </Badge>
                      )}
                      <Badge
                        className={`text-xs ${
                          contract.complexity === "simple"
                            ? "bg-green-600"
                            : contract.complexity === "moderate"
                              ? "bg-yellow-600"
                              : "bg-orange-600"
                        }`}
                      >
                        {contract.complexity.charAt(0).toUpperCase() + contract.complexity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{contract.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveContract(contract.id)}
                      className="text-gray-400 hover:text-yellow-400"
                      title={savedContracts.includes(contract.id) ? "Remove from saved" : "Save contract"}
                    >
                      {savedContracts.includes(contract.id) ? (
                        <Bookmark className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
                      className="h-8 px-2"
                    >
                      {expandedContract === contract.id ? "Less" : "More"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {contract.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400" />
                      <span>{contract.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-green-400" />
                      <span>{contract.securityScore}/100</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-blue-400" />
                      <span>{contract.userCount.toLocaleString()} users</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(contract.createdAt)}</span>
                  </div>
                </div>

                {expandedContract === contract.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Natural Language Description</h4>
                      <div className="bg-gray-750 rounded-md p-3 text-sm">{contract.naturalLanguage}</div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleShowCode(contract.id)}
                        className="h-7 text-xs border-gray-700"
                      >
                        {showCode[contract.id] ? (
                          <>
                            <EyeOff className="mr-1 h-3.5 w-3.5" />
                            Hide Code
                          </>
                        ) : (
                          <>
                            <Code className="mr-1 h-3.5 w-3.5" />
                            View Code
                          </>
                        )}
                      </Button>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>Author:</span>
                        <span className="text-blue-400">{contract.author}</span>
                      </div>
                    </div>

                    {showCode[contract.id] && (
                      <>
                        <div className="bg-gray-900 border border-gray-800 rounded-md p-3 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-blue-400" />
                              <span className="font-mono text-sm">{contract.name.replace(/\s+/g, "")}.sol</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyCode(contract.code)}
                              className="h-7 text-xs border-gray-700"
                            >
                              <Copy className="mr-1 h-3.5 w-3.5" />
                              Copy
                            </Button>
                          </div>

                          <pre className="font-mono text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                            {contract.code}
                          </pre>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs border-gray-700">
                          <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                          Helpful
                        </Button>

                        <Button variant="outline" size="sm" className="h-8 text-xs border-gray-700">
                          <ThumbsDown className="mr-1 h-3.5 w-3.5" />
                          Not Helpful
                        </Button>
                      </div>

                      <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-blue-600 to-purple-600">
                        Use This Contract
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
