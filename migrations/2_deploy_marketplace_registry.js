var MarketplaceRegistry = artifacts.require("MarketplaceRegistry");
//var IERC20 = artifacts.require("IERC20");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');

const _erc20 = tokenAddressList["Kovan"]["DAI"];  // DAI address on Ropsten

const depositedAmount = web3.utils.toWei("5");    // 5 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(MarketplaceRegistry);
    await deployer.deploy(MarketplaceRegistry, _erc20);

    const marketplaceRegistry = await MarketplaceRegistry.deployed();

    const iERC20 = await IERC20.at(_erc20);

    //@dev - Transfer 5 DAI from deployer's address to contract address in advance
    await iERC20.transfer(marketplaceRegistry.address, depositedAmount);
};
