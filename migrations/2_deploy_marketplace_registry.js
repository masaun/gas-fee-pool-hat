var MarketplaceRegistry = artifacts.require("MarketplaceRegistry");
var IERC20 = artifacts.require("IERC20");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');

const _erc20 = tokenAddressList["Kovan"]["DAI"];  // DAI address on Kovan
const _rDai = contractAddressList["Kovan"]["rtoken-contract"]["rDAI-proxy"];  // rDAI
const _rToken = contractAddressList["Kovan"]["rtoken-contract"]["rToken-logic"];
const _allocationStrategy = contractAddressList["Kovan"]["rtoken-contract"]["Allocation-Strategy"];  // rDAI

const depositedAmount = web3.utils.toWei("2.1");    // 2.1 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(MarketplaceRegistry, _erc20, _rDai, _rToken, _allocationStrategy);

    const marketplaceRegistry = await MarketplaceRegistry.deployed();

    const iERC20 = await IERC20.at(_erc20);

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    await iERC20.transfer(marketplaceRegistry.address, depositedAmount);
};
