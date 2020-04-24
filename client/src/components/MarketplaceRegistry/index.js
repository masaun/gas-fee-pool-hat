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


export default class MarketplaceRegistry extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", ""),

            /////// createHat() function 
            createHatRecipientsList: [],
            createHatProportionsList: [],

            /////// mintWithNewHat() function 
            mintWithNewHatRecipientsList: [],
            mintWithNewHatProportionsList: []
        };

        this.getTestData = this.getTestData.bind(this);
        this.handleInputAddRelayer = this.handleInputAddRelayer.bind(this);

        this.handleInputCreateHatRecipients = this.handleInputCreateHatRecipients.bind(this);
        this.handleInputCreateHatProportions = this.handleInputCreateHatProportions.bind(this);

        this.handleInputMintWithSelectedHatMintAmount = this.handleInputMintWithSelectedHatMintAmount.bind(this);
        this.handleInputMintWithSelectedHatHatID = this.handleInputMintWithSelectedHatHatID.bind(this);

        this.handleInputMintWithNewHatMintAmount = this.handleInputMintWithNewHatMintAmount.bind(this);
        this.handleInputMintWithNewHatRecipients = this.handleInputMintWithNewHatRecipients.bind(this);
        this.handleInputMintWithNewHatProportions = this.handleInputMintWithNewHatProportions.bind(this);
    }

    handleInputAddRelayer({ target: { value } }) {
        this.setState({ valueOfAddRelayer: value });
    }

    handleInputCreateHatRecipients({ target: { value } }) {
        this.setState({ valueOfCreateHatRecipients: value });
    }

    handleInputCreateHatProportions({ target: { value } }) {
        this.setState({ valueOfCreateHatProportions: Number(value) });
    }

    handleInputMintWithSelectedHatMintAmount({ target: { value } }) {
        this.setState({ valueOfMintWithSelectedHatMintAmount: value });  //@dev - Already specified "input type"="number"
    }

    handleInputMintWithSelectedHatHatID({ target: { value } }) {
        this.setState({ valueOfMintWithSelectedHatHatID: Number(value) });
    }

    handleInputMintWithNewHatMintAmount({ target: { value } }) {
        this.setState({ valueOfMintAmount: value });  //@dev - Already specified "input type"="number"
    }

    handleInputMintWithNewHatRecipients({ target: { value } }) {
        this.setState({ valueOfMintWithNewHatRecipients: value });
    }

    handleInputMintWithNewHatProportions({ target: { value } }) {
        this.setState({ valueOfMintWithNewHatProportions: Number(value) });
    }


    rTokenInfo = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;
        let response = await marketplace_registry.methods.rTokenInfo().call();
        console.log('=== response of rTokenInfo() function ===', response);
    }

    createHatAddRecipients = async () => {
        const { accounts, web3, createHatRecipientsList, valueOfCreateHatRecipients } = this.state;

        //const createHatRecipientsList = [];
        createHatRecipientsList.push(valueOfCreateHatRecipients);
        console.log('=== createHatRecipientsList ===', createHatRecipientsList);

        this.setState({ valueOfCreateHatRecipients: '' });

        return createHatRecipientsList;
    }

    createHatAddProportions = async () => {
        const { accounts, web3, createHatProportionsList, valueOfCreateHatProportions } = this.state;

        //const createHatProportions = [];
        createHatProportionsList.push(valueOfCreateHatProportions);
        console.log('=== createHatProportionsList ===', createHatProportionsList);

        this.setState({ valueOfCreateHatProportions: '' });

        return createHatProportionsList;
    }

    createHat = async () => {
        const { accounts, web3, marketplace_registry, createHatRecipientsList, createHatProportionsList } = this.state;

        const _recipients = createHatRecipientsList; 
        //const _recipients = [recipient1, recipient2];
        const _proportions = createHatProportionsList;
        //const _proportions = [70, 30];
        const _doChangeHat = true;
        console.log('=== _recipients ===', _recipients);
        console.log('=== _proportions ===', _proportions);

        let response = await marketplace_registry.methods._createHat(_recipients, 
                                                                     _proportions, 
                                                                     _doChangeHat).send({ from: accounts[0] })
        console.log('=== response of _createHat() function ===', response);

        this.setState({ createHatRecipientsList: [], createHatProportionsList: [] });              
    }

    getHatByID = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const _hatID = 222;

        let response = await marketplace_registry.methods._getHatByID(_hatID).call();
        console.log('=== response of _getHatByID() function ===', response);          
    }

    getHatByAddress = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods._getHatByAddress().call();
        console.log('=== response of _getHatByAddress() function ===', response);
    }

    approve = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;    
        //const _spender = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"                    // underlying token (DAI)
        //const _spender = "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB";                   // rDAI-proxy
        //const _spender = contractAddressList["Kovan"]["rtoken-contract"]["rDAI-proxy"];  // rDAI-proxy
        const _amount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）

        let response = await marketplace_registry.methods._approve(_amount).send({ from: accounts[0] });
        console.log('=== response of _approve() function ===', response);     
    }

    allowance = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods._allowance().call();
        console.log('=== response of _allowance() function ===', response);
    }

    mintWithSelectedHat = async () => {
        const { accounts, web3, marketplace_registry, dai, rDAI, marketplace_registry_address, rDAI_address,  valueOfMintWithSelectedHatMintAmount, valueOfMintWithSelectedHatHatID } = this.state;

        const _mintAmount = valueOfMintWithSelectedHatMintAmount;
        //const _mintAmount = 1.05;   // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        const _hatID = valueOfMintWithSelectedHatHatID;
        //const _hatID = 222;

        //@dev - Transfer DAI from UserWallet to DAI-contract
        let decimals = 18;
        let mintAmount = web3.utils.toWei(_mintAmount.toString(), 'ether');
        //let mintAmount = web3.utils.toWei((_mintAmount / ((10)**2)).toString(), 'ether');
        console.log('=== mintAmount ===', mintAmount);
        const _spender = rDAI_address;

        let approved = await dai.methods.approve(_spender, mintAmount).send({ from: accounts[0] });
        console.log('=== dai.sol of approve() function ===', approved);

        let allowance = await dai.methods.allowance(accounts[0], _spender).call();
        console.log('=== dai.sol of allowance() function ===', allowance);

        let response = await rDAI.methods.mintWithSelectedHat(mintAmount, _hatID).send({ from: accounts[0] });
        console.log('=== rDAI.sol of mintWithSelectedHat() function ===', response);     

        this.setState({ valueOfMintWithSelectedHatMintAmount: '', valueOfMintWithSelectedHatHatID: '' });
    }
  
    mintWithNewHatAddRecipients = async () => {
        const { accounts, web3, createHatRecipientsList, valueOfCreateHatRecipients } = this.state;

        //const createHatRecipientsList = [];
        createHatRecipientsList.push(valueOfCreateHatRecipients);
        console.log('=== createHatRecipientsList ===', createHatRecipientsList);

        this.setState({ valueOfCreateHatRecipients: '' });

        return createHatRecipientsList;
    }

    mintWithNewHatAddProportions = async () => {
        const { accounts, web3, createHatProportionsList, valueOfCreateHatProportions } = this.state;

        //const createHatProportions = [];
        createHatProportionsList.push(valueOfCreateHatProportions);
        console.log('=== createHatProportionsList ===', createHatProportionsList);

        this.setState({ valueOfCreateHatProportions: '' });

        return createHatProportionsList;
    }

    mintWithNewHat = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const recipient1 = walletAddressList["addressList"]["address1"];
        const recipient2 = walletAddressList["addressList"]["address2"];

        const _mintAmount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        const _recipients = [recipient1, recipient2];
        const _proportions = [214748364, 4080218930];

        let response = await marketplace_registry.methods._mintWithNewHat(_mintAmount, _recipients, _proportions).send({ from: accounts[0] });
        console.log('=== response of mintWithNewHat() function ===', response);     
    }

    interestPayableOf = async () => {
        const { accounts, marketplace_registry, dai, rDAI, marketplace_registry_address, rDAI_address, web3 } = this.state;

        const _owner = walletAddressList["addressList"]["address1"];

        let interestPayableOfAmount = await rDAI.methods.interestPayableOf(_owner).call();
        console.log('=== rDAI.sol of interestPayableOf() function ===', interestPayableOfAmount);
        //let response = await marketplace_registry.methods._interestPayableOf().call();
        //console.log('=== response of _interestPayableOf() function ===', response);   
    }

    redeem = async () => {
        const { accounts, marketplace_registry, dai, rDAI, marketplace_registry_address, rDAI_address, web3 } = this.state;

        const _redeemTokens = 1.05;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        //const _redeemTokens = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）

        //@dev - Transfer DAI from UserWallet to DAI-contract
        let decimals = 18;
        let redeemTokens = web3.utils.toWei(_redeemTokens.toString(), 'ether');
        console.log('=== redeemTokens ===', redeemTokens);
        const _spender = rDAI_address;

        let response = await rDAI.methods.redeem(redeemTokens).send({ from: accounts[0] });
        console.log('=== rDAI.sol of redeem() function ===', response);    
        //let response = await marketplace_registry.methods._redeem(_redeemTokens).send({ from: accounts[0] });
        //console.log('=== response of _redeem() function ===', response);           
    }

    redeemAll = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods._redeemAll().send({ from: accounts[0] });
        console.log('=== response of _redeemAll() function ===', response);           
    }

    redeemAndTransfer = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const recipient1 = walletAddressList["addressList"]["address1"];

        const _redeemTo = recipient1;
        const _redeemTokens = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）

        let response = await marketplace_registry.methods._redeemAndTransfer(_redeemTo, _redeemTokens).send({ from: accounts[0] });
        console.log('=== response of _redeemAndTransfer() function ===', response);           
    }

    redeemAndTransferAll = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const recipient1 = walletAddressList["addressList"]["address1"];
        const _redeemTo = recipient1;

        let response = await marketplace_registry.methods._redeemAndTransferAll(_redeemTo).send({ from: accounts[0] });
        console.log('=== response of _redeemAndTransferAll() function ===', response);           
    }

    /***
     * @dev - Hat Status
     **/
    getHatStats = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;
        const _hatID = 222;
        let response = await marketplace_registry.methods._getHatStats(_hatID).call();
        console.log('=== response of _getHatStats() function ===', response);           
    }

    balanceOf = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods._balanceOf().call();
        console.log('=== response of _balanceOf() function ===', response);               
    }

    underlying = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;
        let response = await marketplace_registry.methods._underlying().call();
        console.log('=== response of _underlying() function ===', response);
    }

    /***
     * @dev - Meta-Tx by using Biconomy
     **/
    addRelayer = async () => {
        const { accounts, relay_hub, relayer_manager, gas_fee_pool, web3, valueOfAddRelayer } = this.state;

        const _relayerAddress = valueOfAddRelayer;
        let relayer = await relayer_manager.methods.addRelayer(_relayerAddress).send({ from: accounts[0] });
        console.log('=== RelayerManager.sol of addRelayer() function ===', relayer);

        this.setState({ valueOfAddRelayer: '' });
    }

    getAllRelayers = async () => {
        const { accounts, relay_hub, relayer_manager, gas_fee_pool, web3 } = this.state;

        let relayers = await relayer_manager.methods.getAllRelayers().call();
        console.log('=== RelayerManager.sol of getAllRelayers() function ===', relayers);
    }

    getRelayerStatus = async () => {
        const { accounts, relay_hub, relayer_manager, gas_fee_pool, web3 } = this.state;

        let relayers = await relayer_manager.methods.getAllRelayers().call();

        let relayerStatus = await relayer_manager.methods.getRelayerStatus(relayers[0]).call();
        console.log('=== RelayerManager.sol of getRelayerStatus() function ===', relayerStatus);
    }    


    /***
     * @dev - Test Functions
     **/
    getTestData = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const _currentAccount = accounts[0];
        let balanceOf1 = await marketplace_registry.methods.balanceOfCurrentAccount(_currentAccount).call();
        console.log('=== response of balanceOfCurrentAccount() / 1 ===', balanceOf1);
 
        const _mintAmount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）s
        let response = await marketplace_registry.methods.testFunc(_mintAmount).send({ from: accounts[0] })
        console.log('=== response of testFunc() function ===', response);

        let balanceOf2 = await marketplace_registry.methods.balanceOfCurrentAccount(_currentAccount).call();
        console.log('=== response of balanceOfCurrentAccount() / 2 ===', balanceOf2);
    }

    transferDAIFromUserToContract = async () => {
        const { accounts, marketplace_registry, dai, marketplaceRegistryAddress, web3 } = this.state;

        const _mintAmount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）s

        //@dev - Transfer DAI from UserWallet to DAI-contract
        let decimals = 18;
        let _amount = web3.utils.toWei((_mintAmount / ((10)**2)).toString(), 'ether');
        console.log('=== _amount ===', _amount);
        const _to = marketplaceRegistryAddress;
        let response1 = await dai.methods.transfer(_to, _amount).send({ from: accounts[0] });

        //@dev - Transfer DAI from DAI-contract to Logic-contract
        let response2 = await marketplace_registry.methods.transferDAIFromUserToContract(_mintAmount).send({ from: accounts[0] });  // wei
        console.log('=== response of transferDAIFromUserToContract() function ===', response2);
    }


    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceMarketplaceRegistry) => {
        if (instanceMarketplaceRegistry) {
          //console.log('refreshValues of instanceMarketplaceRegistry');
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


            if (MarketplaceRegistry) {
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
                gas_fee_pool: instanceGasFeePool
              }, () => {
                this.refreshValues(
                  instanceMarketplaceRegistry
                );
                setInterval(() => {
                  this.refreshValues(instanceMarketplaceRegistry);
                }, 5000);
              });
            }
            else {
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
                        <h4>Gas Fee Pool</h4> <br />

                        <Card width={"auto"} 
                              maxWidth={"1280px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Register RelayerAddress</h4>
                            <Table>
                                <tr>
                                    <td><Input type="text" placeholder="Please input relayer address" value={this.state.valueOfAddRelayer} onChange={this.handleInputAddRelayer} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.addRelayer}> Add Relayer </Button></td>
                                </tr>
                            </Table>

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getAllRelayers}> Get All Relayers </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getRelayerStatus}> Get Relayer Status </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"1280px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Gas Fee Pool Hat<br />（by using rDAI）</h4> <br />
                            <h4>↓</h4> <br />
                            <h4>Proportions example<br />10%: GasFeePool (To RelayerAddress)<br />90%: Owner</h4> <br />

                            <hr /> <br />
                            <h4>Write Functions</h4>

                            <Table>
                                <tr>
                                    <td><p>Recipients</p></td>
                                    <td><Input type="text" placeholder="Please input recipients address" value={this.state.valueOfCreateHatRecipients} onChange={this.handleInputCreateHatRecipients} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHatAddRecipients}> Add Recipients </Button></td>
                                </tr>
                                <tr>
                                    <td><p>Proportions</p></td>
                                    <td><Input type="text" placeholder="Please input proportions" value={this.state.valueOfCreateHatProportions} onChange={this.handleInputCreateHatProportions} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHatAddProportions}> Add Proportions </Button></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHat}> Create Hat </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Mint Amount</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Mint Amount" value={this.state.valueOfMintWithSelectedHatMintAmount} onChange={this.handleInputMintWithSelectedHatMintAmount} /></td>
                                </tr>
                                <tr>
                                    <td><p>Hat ID</p></td>
                                    <td><Input type="text" placeholder="Please input Hat ID" value={this.state.valueOfMintWithSelectedHatHatID} onChange={this.handleInputMintWithSelectedHatHatID} /></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithSelectedHat}> Mint With Selected Hat </Button></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Mint Amount</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Mint Amount" value={this.state.valueOfMintWithNewHatMintAmount} onChange={this.handleInputMintWithNewHatMintAmount} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><p>Recipients</p></td>
                                    <td><Input type="text" placeholder="Please input recipients address" value={this.state.valueOfMintWithNewHatRecipients} onChange={this.handleInputMintWithNewHatRecipients} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHatAddRecipients}> Add Recipients </Button></td>
                                </tr>
                                <tr>
                                    <td><p>Proportions</p></td>
                                    <td><Input type="text" placeholder="Please input proportions" value={this.state.valueOfMintWithNewHatProportions} onChange={this.handleInputMintWithNewHatProportions} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHatAddProportions}> Add Proportions </Button></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHat}> Mint With New Hat </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeem}> Redeem </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAll}> Redeem All </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransfer}> Redeem And Transfer </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransferAll}> Redeem And Transfer All </Button> <br />

                            <hr /> <br /> 

                            <h4>Read Functions</h4>
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.rTokenInfo}> rToken Info </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getHatByID}> Get Hat By ID </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getHatByAddress}> Get Hat By Address </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getHatStats}> Get Hat Stats </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.allowance}> Allowance rDAI Proxy Contract </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.interestPayableOf}> Interest Payable Of </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.balanceOf}> Balance Of </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.underlying}> Underlying Asset Address </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"1280px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Testing Function</h4>

                            <Button size={'small'} mt={3} mb={2} onClick={this.getTestData}> Get Test Data </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.transferDAIFromUserToContract}> Transfer DAI From User To Contract </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.approve}> Approve rDAI Proxy Contract </Button> <br />
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
