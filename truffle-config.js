require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');  // @notice - Should use new module.
const mnemonic = process.env.MNEMONIC;


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    matic2 : {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://testnet2.matic.network', 0,1);
      },
      network_id: 8995,
      gasPrice: 0,
    },
    matic3: {  //@dev - Success to deploy on Matic Testnet v3 
      provider: () => new HDWalletProvider(mnemonic, `https://testnetv3.matic.network`),
      network_id: 15001,
      gasPrice: '0x0',
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, process.env.RPC_URL_KOVAN)
      },
      network_id: 42, // Kovan's id
      //gas: 4465030,
      //gasPrice: 10000000000,
      skipDryRun: true
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, process.env.RPC_URL_ROPSTEN)
      },
      network_id: '3',
      //gas: 4465030,
      //gasPrice: 10000000000,
      skipDryRun: true
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, process.env.RPC_URL_RINKEBY)
      },
      network_id: '4',
      //gas: 4465030,
      //gasPrice: 10000000000,
      skipDryRun: true
    }
  }
}
