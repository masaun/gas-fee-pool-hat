const GasFeePool = artifacts.require("GasFeePool");
const RelayHub = artifacts.require("RelayHub");
//const RelayerManager = artifacts.require("RelayerManager");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');

var _erc20 = tokenAddressList["Kovan"]["DAI"];  // DAI address on Kovan
var _relayHub = RelayHub.address;
//var _relayerManager = RelayerManager.address;

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(GasFeePool, _erc20, _relayHub);
};
