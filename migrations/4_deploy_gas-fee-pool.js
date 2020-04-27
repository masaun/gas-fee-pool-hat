var GasFeePool = artifacts.require("GasFeePool");
var IERC20 = artifacts.require("IERC20");
var RelayerManager = artifacts.require("RelayerManager");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');

const _erc20 = tokenAddressList["Kovan"]["DAI"];  // DAI address on Kovan
const _rDai = contractAddressList["Kovan"]["rtoken-contract"]["rDAI-proxy"];  // rDAI
const _rToken = contractAddressList["Kovan"]["rtoken-contract"]["rToken-logic"];
const _allocationStrategy = contractAddressList["Kovan"]["rtoken-contract"]["Allocation-Strategy"];  // rDAI
const _relayerManager = RelayerManager.address;

const depositedAmount = web3.utils.toWei("2.1");    // 2.1 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GasFeePool, 
                          _erc20, 
                          _rDai, 
                          _rToken, 
                          _allocationStrategy, 
                          _relayerManager);

    const gasFeePool = await GasFeePool.deployed();

    const iERC20 = await IERC20.at(_erc20);

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    await iERC20.transfer(gasFeePool.address, depositedAmount);
};
