### UBI Crypto Wallet App

A demonstration application showcasing a decentralized Universal Basic Income (UBI) platform with integrated wallet functionality, social features, and token streaming capabilities.





## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Development](#future-development)
- [Limitations](#limitations)


## 🌐 Overview

The UBI Crypto Wallet App is a proof-of-concept demonstration of a decentralized platform that combines a crypto wallet with Universal Basic Income distribution, social networking, and programmable token streams. The application showcases how blockchain technology could be leveraged to create a more equitable financial system with transparent, user-friendly interfaces.

**Important Note**: This is a demonstration platform only. No real blockchain transactions are executed, and no real data is being used.

### Target Audience

- Developers interested in Web3 and decentralized finance applications
- UX/UI designers exploring blockchain application interfaces
- Researchers and advocates of Universal Basic Income systems
- Crypto enthusiasts interested in social and financial applications of blockchain


## ✨ Features

### Core Functionality

- **Wallet Management**

- View balance and transaction history
- Generate and manage cryptographic keypairs
- Track token streams and transfers



- **Universal Basic Income (UBI)**

- Periodic UBI claim system
- Claim history tracking
- Verification requirements for claims



- **Human Verification System**

- Multiple verification methods (ID, biometric, proof-of-humanity)
- Zero-knowledge proof explanations
- Personalized handles for verified users
- Visual verification indicators throughout the app



- **Smart Contracts**

- Natural language contract creation
- Token streaming contracts
- Example contract templates
- Contract execution simulation





### Social Features

- **Social Feed**

- Post creation and interaction
- Comment system
- Media attachments
- Tipping functionality



- **Democratic Polls**

- Poll creation with UBI allocation
- Voting system for verified users
- Results visualization
- Time-limited polls





### Network Features

- **Node Settings**

- Light node simulation
- Network statistics
- Sync status



- **Block Explorer**

- Transaction history
- Block information
- Search functionality





### UI/UX Features

- **Responsive Interface**

- Mobile-optimized design
- Fixed bottom navigation
- Persistent warning banner



- **Dark Mode**

- Modern dark theme throughout
- Gradient accents
- Consistent styling





## 🔧 Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: Customized shadcn/ui components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Cryptography**: TweetNaCl.js


## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn


### Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/ubi-crypto-wallet.git
cd ubi-crypto-wallet
```


2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Start the development server:

```shellscript
npm run dev
# or
yarn dev
```


4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📱 Usage

### Home Screen

The home screen provides quick access to all main features, displays your current balance, and shows notification about verification status and upcoming UBI claims.

### Wallet

Navigate to the wallet page to:

- View your current balance
- See transaction history
- Monitor active token streams
- Copy your wallet address


### UBI Claims

The UBI page allows you to:

- Claim your periodic UBI allocation (if verified)
- View claim history
- See when your next claim will be available


### Verification

To access UBI and other verified-only features:

1. Navigate to the Verify page
2. Choose a username for your personalized handle
3. Select a verification method (ID, biometric, or proof of humanity)
4. Complete the verification process


### Social Feed

On the feed page you can:

- Create posts with or without media attachments
- Comment on existing posts
- Like and tip content from other users
- Create and vote in democratic polls (verified users)


### Smart Contracts

The contracts page allows you to:

- Create contracts using natural language
- Set up token streaming contracts
- Browse example contract templates
- Execute simulated contracts


### Block Explorer

The explorer page lets you:

- Search for transactions, blocks, or addresses
- View recent blocks and transactions
- Monitor network activity


## 📁 Project Structure

```plaintext
ubi-crypto-wallet/
├── app/                  # Next.js app router pages
│   ├── contracts/        # Smart contract creation
│   ├── explorer/         # Block explorer
│   ├── feed/             # Social feed
│   ├── node/             # Node settings
│   ├── ubi/              # UBI claims
│   ├── verify/           # Identity verification
│   ├── wallet/           # Wallet management
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   ├── contract-composer.tsx
│   ├── demo-warning-banner.tsx
│   ├── nav-bar.tsx
│   ├── social-feed.tsx
│   └── wallet-card.tsx
├── lib/                  # Utility functions and stores
│   ├── stores/           # Zustand state stores
│   ├── ai.ts             # Mock AI functionality
│   ├── crypto.ts         # Cryptography utilities
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   └── images/           # Image assets
└── README.md             # Project documentation
```

## 🔮 Future Development

The following features could be implemented to enhance the application:

- **Real Blockchain Integration**

- Connect to actual blockchain networks
- Implement web3 wallet connection (MetaMask, WalletConnect)
- Deploy real smart contracts



- **Enhanced Social Features**

- Direct messaging
- Group creation
- Content discovery algorithms
- Advanced media support



- **Expanded Verification System**

- Multi-factor verification
- Reputation system
- Soulbound token integration
- Decentralized identity protocols



- **Governance Mechanisms**

- DAO-like governance structure
- Proposal creation and voting
- Treasury management
- Community challenges



- **Developer Tools**

- API access
- Webhook integration
- Plugin system
- Custom contract templates





## ⚠️ Limitations

As this is a demonstration project, it has several limitations:

- **No Real Blockchain**: The application simulates blockchain functionality but doesn't connect to any actual blockchain.
- **Mock Data**: All data is mocked and doesn't persist between sessions (except for local storage).
- **Limited Security**: While the app demonstrates cryptographic concepts, it's not secure enough for handling real assets.
- **Simplified Verification**: The verification process is simulated and doesn't actually verify identity.
- **Performance**: The application hasn't been optimized for large-scale use or tested with high volumes of data.
- **Mobile Optimization**: While designed with mobile in mind, some features may not be fully optimized for all device sizes.


## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Design inspiration from various Web3 applications
- shadcn/ui for the component system
- The Next.js team for the framework
- All open-source libraries used in this project


---

**Disclaimer**: This application is for demonstration purposes only. It does not use real cryptocurrency, blockchain networks, or personal data. All transactions and interactions are simulated.