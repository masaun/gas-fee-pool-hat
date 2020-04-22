import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import App from "../../App.js";

import { Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../../utils/theme';
import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';
//import './App.css';

import { walletAddressList } from '../../data/testWalletAddress.js'
import { contractAddressList } from '../../data/contractAddress/contractAddress.js'

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

let sigUtil = require("eth-sig-util");


/***
 * @dev - Global Variable
 **/
const quote = "This is a default quote";
const setQuote = "This is a default quote";
const owner = "Default Owner Address";
const setOwner = "Default Owner Address";
const newQuote = "";
const setNewQuote = "";
const selectedAddress = "";
const setSelectedAddress = "";
const metaTxEnabled = true;
const setMetaTxEnabled = true;


/***
 * @dev - Method
 **/
export default class MetaTransactionTest extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        this.executeMetaTransactionTest = this.executeMetaTransactionTest.bind(this);
    }

    executeMetaTransactionTest = async () => {
        const { accounts, gas_fee_pool, web3, domainType, metaTransactionType, domainData } = this.state;

        console.log("Sending meta transaction");
        let userAddress = selectedAddress;
        let nonce = await gas_fee_pool.methods.getNonce(userAddress).call();
        let functionSignature = gas_fee_pool.methods.setQuote(newQuote).encodeABI();
        let message = {};
        message.nonce = parseInt(nonce);
        message.from = userAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType
          },
          domain: domainData,
          primaryType: "MetaTransaction",
          message: message
        });
        console.log(domainData);
        console.log();
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            id: 999999999999,
            method: "eth_signTypedData_v4",
            params: [userAddress, dataToSign]
          },
          function(error, response) {
            console.info(`User signature is ${response.result}`);
            if (error || (response && response.error)) {
              this.showErrorMessage("Could not get user signature");
            } else if (response && response.result) {
              let { r, s, v } = this.getSignatureParameters(response.result);
              console.log(userAddress);
              console.log(JSON.stringify(message));
              console.log(message);
              console.log(this.getSignatureParameters(response.result));

              const recovered = sigUtil.recoverTypedSignature_v4({
                data: JSON.parse(dataToSign),
                sig: response.result
              });
              console.log(`Recovered ${recovered}`);
              this.sendTransaction(userAddress, functionSignature, r, s, v);
            }
          }
        );

        //@dev - Execute function
        const _newQuote = "Write new quote for Test Meta-Transaction";
        let response = await gas_fee_pool.methods.executeMetaTransactionTest(_newQuote).send({ from: accounts[0] });
        console.log('=== response of executeMetaTransactionTest() ===', response);
    }

    setQuote = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        const _newQuote = "Write new quote for Test Meta-Transaction";
        let response = await gas_fee_pool.methods.setQuote(_newQuote).send({ from: accounts[0] });
        console.log('=== response of setQuote() ===', response);
    }


    ////////////////////////////////////
    ///// Internal function 
    ////////////////////////////////////
    getSignatureParameters = signature => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        if (!web3.utils.isHexStrict(signature)) {
          throw new Error(
            'Given value "'.concat(signature, '" is not a valid hex string.')
          );
        }
        var r = signature.slice(0, 66);
        var s = "0x".concat(signature.slice(66, 130));
        var v = "0x".concat(signature.slice(130, 132));
        v = web3.utils.hexToNumber(v);
        if (![27, 28].includes(v)) v += 27;
        return {
          r: r,
          s: s,
          v: v
        };
    };

    getQuoteFromNetwork = () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        if (web3 && gas_fee_pool) {
          gas_fee_pool.methods
            .getQuote()
            .call()
            .then(function(result) {
              console.log(result);
              if (
                result &&
                result.currentQuote != undefined &&
                result.currentOwner != undefined
              ) {
                if (result.currentQuote == "") {
                  this.showErrorMessage("No quotes set on blockchain yet");
                } else {
                  setQuote(result.currentQuote);
                  setOwner(result.currentOwner);
                }
              } else {
                this.showErrorMessage("Not able to get quote information from Network");
              }
            });
        }
    };

    showErrorMessage = message => {
        NotificationManager.error(message, "Error", 5000);
    };

    showSuccessMessage = message => {
        NotificationManager.success(message, "Message", 3000);
    };

    showInfoMessage = message => {
        NotificationManager.info(message, "Info", 3000);
    };

    sendTransaction = async (userAddress, functionData, r, s, v) => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        if (web3 && gas_fee_pool) {
          try {
            let gasLimit = await gas_fee_pool.methods
              .executeMetaTransaction(userAddress, functionData, r, s, v)
              .estimateGas({ from: userAddress });
            let gasPrice = await web3.eth.getGasPrice();
            console.log(gasLimit);
            console.log(gasPrice);
            let tx = gas_fee_pool.methods
              .executeMetaTransaction(userAddress, functionData, r, s, v)
              .send({
                from: userAddress,
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(gasLimit)
              });

            tx.on("transactionHash", function(hash) {
              console.log(`Transaction hash is ${hash}`);
              this.showInfoMessage(`Transaction sent by relayer with hash ${hash}`);
            }).once("confirmation", function(confirmationNumber, receipt) {
              console.log(receipt);
              this.showSuccessMessage("Transaction confirmed on chain");
              this.getQuoteFromNetwork();
            });
          } catch (error) {
            console.log(error);
          }
        }
    };




    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceMarketplaceRegistry) => {
        if (instanceMarketplaceRegistry) {
          console.log('refreshValues of instanceMarketplaceRegistry');
        }
    }


    //////////////////////////////////// 
    ///// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
            this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
            return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        /***
         * @dev - General Definition
         **/
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let MarketplaceRegistry = {};
        let Dai = {};
        let rDAI = {};
        let RelayHub = {};
        let RelayerManager = {};
        let GasFeePool = {};
        try {
          MarketplaceRegistry = require("../../../../build/contracts/MarketplaceRegistry.json");  // Load artifact-file of MarketplaceRegistry
          Dai = require("../../../../build/contracts/Dai.json");    //@dev - DAI（Underlying asset）
          rDAI = require("../../../../build/contracts/rDAI.json");  //@dev - rDAI（rDAI proxy contract）
          RelayHub = require("../../../../build/contracts/RelayHub.json");  //@dev - Artifact of RelayHub contract
          RelayerManager = require("../../../../build/contracts/RelayerManager.json");  //@dev - Artifact of RelayerManager contract
          GasFeePool = require("../../../../build/contracts/GasFeePool.json");  
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceMarketplaceRegistry = null;
            let deployedNetwork = null;

            // Create instance of contracts
            if (MarketplaceRegistry.networks) {
              deployedNetwork = MarketplaceRegistry.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceMarketplaceRegistry = new web3.eth.Contract(
                  MarketplaceRegistry.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceMarketplaceRegistry ===', instanceMarketplaceRegistry);
              }
            }

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let MarketplaceRegistryAddress = MarketplaceRegistry.networks[networkId.toString()].address;
            let DaiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"; //@dev - DAI（Underlying asset）
            instanceDai = new web3.eth.Contract(
              Dai.abi,
              DaiAddress,
            );
            console.log('=== instanceDai ===', instanceDai);

            //@dev - Create instance of rDAI-contract
            let instanceRDai = null;
            let rDaiAddress = "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB"; //@dev - rDAI（rDAI proxy contract）
            instanceRDai = new web3.eth.Contract(
              rDAI.abi,
              rDaiAddress,
            );
            console.log('=== instanceRDai ===', instanceRDai); 

            //@dev - Create instance of RelayHub
            let instanceRelayHub = null;
            if (RelayHub.networks) {
              deployedNetwork = RelayHub.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceRelayHub = new web3.eth.Contract(
                  RelayHub.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceRelayHub ===', instanceRelayHub);
              }
            }
            
            //@dev - Create instance of RelayerManager
            let instanceRelayerManager = null;
            if (RelayerManager.networks) {
              deployedNetwork = RelayerManager.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceRelayerManager = new web3.eth.Contract(
                   RelayerManager.abi,
                   deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceRelayerManager ===', instanceRelayerManager);
              }
            }
            // let instanceRelayerManager = null;
            // let RelayerManagerAddress = "0x6651360Ff49cD68c783D4cdC16D7A9C1f13873Eb"; //@dev - RelayerManager.sol address
            // instanceRelayerManager = new web3.eth.Contract(
            //   RelayerManager.abi,
            //   RelayerManagerAddress,
            // );
            // console.log('=== instanceRelayerManager ===', instanceRelayerManager); 

            //@dev - Create instance of GasFeePool.sol
            let instanceGasFeePool = null;
            if (GasFeePool.networks) {
              deployedNetwork = GasFeePool.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGasFeePool = new web3.eth.Contract(
                   GasFeePool.abi,
                   deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceGasFeePool ===', instanceGasFeePool);
              }
            }

            /***
             * @dev - Definition for Meta-Transaction test
             **/
            const domainType = [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" }
            ];

            const metaTransactionType = [
              { name: "nonce", type: "uint256" },
              { name: "from", type: "address" },
              { name: "functionSignature", type: "bytes" }
            ];

            let domainData = {
              name: "TestContract",
              version: "1",
              verifyingContract: instanceGasFeePool.address,
              verifyingContract: instanceGasFeePool.address
            };

            if (MarketplaceRegistry || Dai || rDAI || RelayHub || RelayerManager || GasFeePool) {
              // Set web3, accounts, and contract to the state, and then proceed with an
              // example of interacting with the contract's methods.
              this.setState({ 
                web3, 
                ganacheAccounts, 
                accounts, 
                balance, 
                networkId, 
                networkType, 
                hotLoaderDisabled,
                isMetaMask, 
                marketplace_registry: instanceMarketplaceRegistry,
                dai: instanceDai,
                rDAI: instanceRDai,
                marketplace_registry_address: MarketplaceRegistryAddress,
                rDAI_address: rDaiAddress,
                relay_hub: instanceRelayHub,
                relayer_manager: instanceRelayerManager,
                gas_fee_pool: instanceGasFeePool,
                domainType: domainType,
                metaTransactionType: metaTransactionType,
                domainData: domainData
              }, () => {
                this.refreshValues(
                  instanceMarketplaceRegistry
                );
                setInterval(() => {
                  this.refreshValues(instanceMarketplaceRegistry);
                }, 5000);
              });
            } else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }


    render() {
        const { accounts, marketplace_registry } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Meta-Transaction Test</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.executeMetaTransactionTest}> Execute Meta-Transaction Test </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.setQuote}> Set Quote </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
