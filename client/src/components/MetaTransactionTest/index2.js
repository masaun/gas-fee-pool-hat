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
require('dotenv').config();
const INFURA_API_KEY = process.env.INFURA_API_KEY;


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

        this.handleInputExecuteMetaTransactionTestNewText = this.handleInputExecuteMetaTransactionTestNewText.bind(this);
        this.handleInputSetTextNewText = this.handleInputSetTextNewText.bind(this);

        this.executeMetaTransactionTest = this.executeMetaTransactionTest.bind(this);
        this.setText = this.setText.bind(this);
    }

    handleInputExecuteMetaTransactionTestNewText({ target: { value } }) {
        this.setState({ valueOfExecuteMetaTransactionTestNewText: value });
    }

    handleInputSetTextNewText({ target: { value } }) {
        this.setState({ valueOfSetTextNewText: value });
    }

    executeMetaTransactionTest = async () => {
        const { accounts, web3, meta_transaction_test, domainType, metaTransactionType, domainData, valueOfExecuteMetaTransactionTestNewText } = this.state;

        //@dev - Execute function
        const _newText = valueOfExecuteMetaTransactionTestNewText;
        let response = await meta_transaction_test.methods.executeMetaTransactionTest(_newText).send({ from: accounts[0] });
        console.log('=== response of executeMetaTransactionTest() ===', response);

        this.setState({ valueOfExecuteMetaTransactionTestNewText: '' });
    }

    setText = async () => {
        const { accounts, web3, meta_transaction_test, domainType, metaTransactionType, domainData, valueOfSetTextNewText } = this.state;

        /***
         * @dev - Global Variable
         **/
        const text = "This is a default text";
        const setText = "This is a default text";
        const owner = "Default Owner Address";
        const setOwner = "Default Owner Address";
        const newText = "Test New Text";
        const setNewText = valueOfSetTextNewText;
        const selectedAddress = accounts[0];
        //const selectedAddress = "";
        const setSelectedAddress = accounts[0];
        ///const setSelectedAddress = "";
        const metaTxEnabled = true;
        const setMetaTxEnabled = true;

        if (newText != "" && meta_transaction_test) {
          if (metaTxEnabled) {

            console.log("=== Sending meta transaction ===");
            let userAddress = selectedAddress;
            let nonce = await meta_transaction_test.methods.getNonce(userAddress).call();
            let functionSignature = meta_transaction_test.methods.setText(newText).encodeABI();
            let message = {};
            message.nonce = parseInt(nonce);
            message.from = userAddress;
            message.functionSignature = functionSignature;
            console.log("=== functionSignature ===", functionSignature);

            const dataToSign = JSON.stringify({
              types: {
                EIP712Domain: domainType,
                MetaTransaction: metaTransactionType
              },
              domain: domainData,
              primaryType: "MetaTransaction",
              message: message
            });
            console.log("=== domainData ===", domainData);
            console.log("=== web3.currentProvider ===", web3.currentProvider);
            web3.currentProvider.send(
              {
                jsonrpc: "2.0",
                id: 999999999999,
                method: "eth_signTypedData_v4",
                params: [userAddress, dataToSign]
              },
              function(error, response) {
                console.info(`=== User signature is ${response.result} ===`);
                if (error || (response && response.error)) {
                  console.log("=== Could not get user signature ===");
                  console.log("=== error ===", error);
                  //this.showErrorMessage("Could not get user signature");
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
          } else {
            console.log("=== Sending normal transaction ===");
            meta_transaction_test.methods
              .setText(newText)
              .send({ from: selectedAddress })
              .on("transactionHash", function(hash) {
                  console.log(`=== Transaction sent to blockchain with hash ${hash} ===`);
                  //showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
              })
              .once("confirmation", function(confirmationNumber, receipt) {
                  console.log("=== Transaction confirmed ===");
                  //showSuccessMessage("Transaction confirmed");
                  this.getTextFromNetwork();
              });
          }
        } else {
            console.log("=== Please enter the text ===");
            //showErrorMessage("Please enter the quote");
        }

        this.setState({ valueOfSetTextNewText: '' });
    }


    ////////////////////////////////////
    ///// Internal function 
    ////////////////////////////////////
    getSignatureParameters = signature => {
        const { accounts, meta_transaction_test, web3 } = this.state;

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

    getTextFromNetwork = () => {
        const { accounts, meta_transaction_test, web3 } = this.state;

        if (web3 && meta_transaction_testl) {
          meta_transaction_test.methods
            .getText()
            .call()
            .then(function(result) {
              console.log("=== result ===", result);
              if (
                result &&
                result.currentText != undefined &&
                result.currentOwner != undefined
              ) {
                if (result.currentText == "") {
                  console.log("=== No texts set on blockchain yet ===");
                  //this.showErrorMessage("No texts set on blockchain yet");
                } else {
                  meta_transaction_test.methods.setText(result.currentText);
                  meta_transaction_test.methods.setOwner(result.currentOwner);
                }
              } else {
                this.showErrorMessage("Not able to get text information from Network");
              }
            });
        }
    };

    showErrorMessage = (message) => {
        NotificationManager.error(message, "Error", 5000);
    };

    showSuccessMessage = async (message) => {
        await NotificationManager.success(message, "Message", 3000);
    };

    showInfoMessage = message => {
        NotificationManager.info(message, "Info", 3000);
    };

    sendTransaction = async (userAddress, functionData, r, s, v) => {
        const { accounts, meta_transaction_test, web3 } = this.state;

        if (web3 && meta_transaction_test) {
          try {
            let gasLimit = await meta_transaction_test.methods
              .executeMetaTransaction(userAddress, functionData, r, s, v)
              .estimateGas({ from: userAddress });
            let gasPrice = await web3.eth.getGasPrice();
            console.log(gasLimit);
            console.log(gasPrice);
            let tx = meta_transaction_test.methods
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
              this.getTextFromNetwork();
            });
          } catch (error) {
            console.log(error);
          }
        }
    };




    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceGasFeePool) => {
        if (instanceGasFeePool) {
          console.log('refreshValues of instanceGasFeePool');
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
     
        let GasFeePool = {};
        let Dai = {};
        let rDAI = {};
        let RelayHub = {};
        let RelayerManager = {};
        let MetaTransactionTest = {};
        try {
          GasFeePool = require("../../../../build/contracts/GasFeePool.json");  // Load artifact-file of GasFeePool
          Dai = require("../../../../build/contracts/Dai.json");    //@dev - DAI（Underlying asset）
          rDAI = require("../../../../build/contracts/rDAI.json");  //@dev - rDAI（rDAI proxy contract）
          RelayHub = require("../../../../build/contracts/RelayHub.json");  //@dev - Artifact of RelayHub contract
          RelayerManager = require("../../../../build/contracts/RelayerManager.json");  //@dev - Artifact of RelayerManager contract
          MetaTransactionTest = require("../../../../build/contracts/MetaTransactionTest.json");  
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

            let instanceGasFeePool = null;
            let deployedNetwork = null;

            // Create instance of contracts
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

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let GasFeePoolRegistryAddress = GasFeePool.networks[networkId.toString()].address;
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
            let instanceMetaTransactionTest = null;
            let MetaTransactionTestAddress = "";
            if (MetaTransactionTest.networks) {
              deployedNetwork = MetaTransactionTest.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceMetaTransactionTest = new web3.eth.Contract(
                   MetaTransactionTest.abi,
                   deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceMetaTransactionTest ===', instanceMetaTransactionTest);

                MetaTransactionTestAddress = deployedNetwork.address;
              }
            }
            console.log('=== MetaTransactionTestAddress ===', MetaTransactionTestAddress);

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
              name: "MetaTransactionTest",
              version: "1",
              verifyingContract: MetaTransactionTestAddress,
              verifyingContract: MetaTransactionTestAddress
            };

            if (GasFeePool || Dai || rDAI || RelayHub || RelayerManager || MetaTransactionTest) {
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
                gas_fee_pool: instanceGasFeePool,
                dai: instanceDai,
                rDAI: instanceRDai,
                gas_fee_pool_address: GasFeePoolAddress,
                rDAI_address: rDaiAddress,
                relay_hub: instanceRelayHub,
                relayer_manager: instanceRelayerManager,
                meta_transaction_test: instanceMetaTransactionTest,
                domainType: domainType,
                metaTransactionType: metaTransactionType,
                domainData: domainData
              }, () => {
                this.refreshValues(
                  instanceGasFeePool
                );
                setInterval(() => {
                  this.refreshValues(instanceGasFeePool);
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
        const { accounts, gas_fee_pool } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"960px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Meta-Transaction Test</h4> <br />

                            <Table>
                                <tr>
                                    <td><p>New Text</p></td>
                                    <td><Input type="text" placeholder="Please input New Text" value={this.state.valueOfExecuteMetaTransactionTestNewText} onChange={this.handleInputExecuteMetaTransactionTestNewText} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.executeMetaTransactionTest}> Execute Meta-Transaction Test </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>New Text</p></td>
                                    <td><Input type="text" placeholder="Please input New Text" value={this.state.valueOfSetTextNewText} onChange={this.handleInputSetTextNewText} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.setText}> Set Text </Button></td>
                                    <td></td>
                                </tr>
                            </Table>
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
