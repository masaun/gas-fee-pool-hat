require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');  // @notice - Should use new module.
const mnemonic = process.env.MNEMONIC;


module.exports = {
  //@dev - For rtoken-contract
  plugins: [
      //"truffle-security",
      "solidity-coverage",
      "truffle-plugin-verify"
  ],

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic, 
          process.env.RPC_URL_KOVAN,
          0,    // address_index
          10,   // num_addresses
          true  // shareNonce
        )
      },
      network_id: 42, // Kovan's id
      //gas: 7017622,
      //confirmations: 2,  // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,   // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
  }
}
