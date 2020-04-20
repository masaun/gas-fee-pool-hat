const GasFeePool = artifacts.require("GasFeePool");
const RelayerManager = artifacts.require("RelayerManager");

var _erc20 = tokenAddressList["Kovan"]["DAI"];  // DAI address on Kovan
var _relayerManager = RelayerManager.address;

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(GasFeePool, _erc20, _relayerManager);
};
