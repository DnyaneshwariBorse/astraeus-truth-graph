# Astraeus Truth Verification - The Graph Subgraph

A subgraph for indexing truth verification scores on Arbitrum One mainnet using The Graph protocol.

## 📋 Project Overview

This project deploys a Truth Verification smart contract on Arbitrum One and indexes its events using The Graph protocol. The subgraph tracks truth scores and verification events in real-time.

## 🚀 Deployed Contracts & Endpoints

### Arbitrum One Mainnet

**Smart Contract:**
- **Address:** `0x51cC02dB8052390645955CF39c1Ac55531131928`
- **Network:** Arbitrum One (Chain ID: 42161)
- **Deployment Block:** 420786645
- **Explorer:** [View on Arbiscan](https://arbiscan.io/address/0x51cC02dB8052390645955CF39c1Ac55531131928)

**Subgraph:**
- **Name:** astraeus-truth-mainnet
- **Version:** v0.1.0
- **Studio URL:** https://thegraph.com/studio/subgraph/astraeus-truth-mainnet
- **Query Endpoint:** https://api.studio.thegraph.com/query/1722808/astraeus-truth-mainnet/v0.1.0

### Sepolia Testnet (Previous Testing)

**Smart Contract:**
- **Address:** `0x0257E4eDDb22d142b6E8E632733C56fa3cD13C86`
- **Network:** Sepolia Testnet

## 📊 Schema

The subgraph indexes two main entities:

### TruthScore
```graphql
type TruthScore @entity {
  id: ID!                 # Query hash
  user: Bytes!            # User wallet address
  score: BigInt!          # Truth score (0-100)
  timestamp: BigInt!      # Block timestamp
}
```

### Verification
```graphql
type Verification @entity {
  id: ID!                 # Transaction hash + log index
  queryHash: Bytes!       # Query identifier
  score: BigInt!          # Verification score
  blockNumber: BigInt!    # Block number of verification
}
```

## 🔍 Sample Queries

### Get Recent Truth Scores
```graphql
{
  truthScores(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    user
    score
    timestamp
  }
}
```

### Get All Verifications
```graphql
{
  verifications(first: 10, orderBy: blockNumber, orderDirection: desc) {
    id
    queryHash
    score
    blockNumber
  }
}
```

### Get Specific User's Scores
```graphql
{
  truthScores(where: { user: "0x3c0cb0810f981de369f4afe1b33b6eeed7e9e5b1" }) {
    id
    score
    timestamp
  }
}
```

## 🛠️ Development Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- MetaMask with Arbitrum One network
- Graph CLI

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/DnyaneshwariBorse/astraeus-truth-graph.git
cd astraeus-truth-graph
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Graph CLI:**
```bash
sudo npm install -g @graphprotocol/graph-cli
```

### Deploy Smart Contract (Remix)

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create `TruthVerification.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract TruthVerification {
    event QueryTruthScore(bytes32 indexed queryHash, uint256 score);
    
    mapping(bytes32 => uint256) public truthScores;
    
    function verifyTruth(bytes32 queryHash, uint256 score) public {
        require(score <= 100, "Score must be <= 100");
        truthScores[queryHash] = score;
        emit QueryTruthScore(queryHash, score);
    }
    
    function getTruthScore(bytes32 queryHash) public view returns (uint256) {
        return truthScores[queryHash];
    }
}
```
3. Compile with Solidity 0.8.21
4. Deploy to Arbitrum One using MetaMask
5. Note the contract address and deployment block

### Configure Subgraph

Edit `subgraph.yaml`:
```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: TruthVerification
    network: arbitrum-one
    source:
      address: "YOUR_CONTRACT_ADDRESS"
      abi: TruthVerification
      startBlock: YOUR_DEPLOYMENT_BLOCK
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - TruthScore
        - Verification
      abis:
        - name: TruthVerification
          file: ./abis/TruthVerification.json
      eventHandlers:
        - event: QueryTruthScore(indexed bytes32,uint256)
          handler: handleQueryTruthScore
      file: ./src/mapping.ts
```

### Deploy Subgraph

1. **Authenticate with The Graph Studio:**
```bash
graph auth --studio YOUR_DEPLOY_KEY
```

2. **Build the subgraph:**
```bash
graph codegen && graph build
```

3. **Deploy to Studio:**
```bash
graph deploy --studio astraeus-truth-mainnet
```

4. **Choose version label** (e.g., v0.1.0, v0.1.1, etc.)

## 📝 Usage

### Interacting with Contract (Remix)

**Add a Truth Score:**
```javascript
// In Remix, call verifyTruth function:
queryHash: 0x1111111111111111111111111111111111111111111111111111111111111111
score: 85
```

**Get Truth Score:**
```javascript
// Call getTruthScore function:
queryHash: 0x1111111111111111111111111111111111111111111111111111111111111111
// Returns: 85
```

### Querying Subgraph (JavaScript/TypeScript)
```javascript
const query = `
{
  truthScores(first: 5) {
    id
    user
    score
    timestamp
  }
}
`;

const response = await fetch(
  'https://api.studio.thegraph.com/query/1722808/astraeus-truth-mainnet/v0.1.0',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }
);

const data = await response.json();
console.log(data);
```

## 🧪 Testing Status

**Current Phase:** ✅ Testing on Mainnet

- ✅ Smart contract deployed on Arbitrum One mainnet
- ✅ Subgraph deployed and indexing successfully  
- ✅ Test transactions confirmed working
- ✅ Query endpoints functional
- ⏳ Awaiting production usage with real data

**Test Data Used:**
- Query Hash: `0x1111111111111111111111111111111111111111111111111111111111111111`
- Score: `85`
- User: `0x3c0cb0810f981de369f4afe1b33b6eeed7e9e5b1`

## 📁 Project Structure
```
.
├── abis/
│   └── TruthVerification.json      # Contract ABI
├── src/
│   └── mapping.ts                   # Subgraph mapping logic
├── contracts/                       # Smart contract source
├── build/                           # Compiled subgraph
├── schema.graphql                   # GraphQL schema
├── subgraph.yaml                    # Subgraph manifest
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🔗 Important Links

- **Contract Explorer:** https://arbiscan.io/address/0x51cC02dB8052390645955CF39c1Ac55531131928
- **Subgraph Studio:** https://thegraph.com/studio/subgraph/astraeus-truth-mainnet
- **The Graph Docs:** https://thegraph.com/docs
- **Arbitrum Docs:** https://docs.arbitrum.io

## ⚙️ Configuration

### Networks

**Arbitrum One:**
- RPC URL: `https://arb1.arbitrum.io/rpc`
- Chain ID: `42161`
- Explorer: `https://arbiscan.io`

### Gas Costs (Arbitrum One)
- Contract Deployment: ~0.0001-0.0005 ETH
- Transaction (verifyTruth): ~0.00001-0.00005 ETH

## 🐛 Troubleshooting

### Subgraph Not Indexing
- Check if contract address is correct
- Verify startBlock is set to deployment block
- Ensure network is set to `arbitrum-one`
- Wait 2-3 minutes after transactions for indexing

### MetaMask Connection Issues
- Ensure Arbitrum One network is added
- Check you're on the correct network (Chain ID: 42161)
- Verify sufficient ETH balance for gas

### Build Errors
```bash
# Clear cache and rebuild
rm -rf build generated
graph codegen
graph build
```

## 📄 License

MIT License

## 👥 Contributors

- Dnyaneshwari Borse - [GitHub](https://github.com/DnyaneshwariBorse)

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/DnyaneshwariBorse/astraeus-truth-graph/issues
- The Graph Discord: https://discord.gg/graphprotocol

---

**Status:** 🟢 Live on Arbitrum One Mainnet

**Last Updated:** January 13, 2026
