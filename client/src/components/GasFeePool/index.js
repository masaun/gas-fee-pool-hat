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


export default class GasFeePool extends Component {
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

        /////// Input value buttons
        this.handleInputAddRelayer = this.handleInputAddRelayer.bind(this);

        this.handleInputCreateHatRecipients = this.handleInputCreateHatRecipients.bind(this);
        this.handleInputCreateHatProportions = this.handleInputCreateHatProportions.bind(this);

        this.handleInputMintWithSelectedHatMintAmount = this.handleInputMintWithSelectedHatMintAmount.bind(this);
        this.handleInputMintWithSelectedHatHatID = this.handleInputMintWithSelectedHatHatID.bind(this);

        this.handleInputMintWithNewHatMintAmount = this.handleInputMintWithNewHatMintAmount.bind(this);
        this.handleInputMintWithNewHatRecipients = this.handleInputMintWithNewHatRecipients.bind(this);
        this.handleInputMintWithNewHatProportions = this.handleInputMintWithNewHatProportions.bind(this);

        this.handleInputRedeemTokens = this.handleInputRedeemTokens.bind(this);        
        this.handleInputRedeemAndTransferRedeemTo = this.handleInputRedeemAndTransferRedeemTo.bind(this);        
        this.handleInputRedeemAndTransferRedeemTokens = this.handleInputRedeemAndTransferRedeemTokens.bind(this);        
        this.handleInputRedeemAndTransferAllRedeemTo = this.handleInputRedeemAndTransferAllRedeemTo.bind(this);

        /////// Submit buttons
        this.addRelayer = this.addRelayer.bind(this);

        this.createHat = this.createHat.bind(this);
        this.mintWithSelectedHat = this.mintWithSelectedHat.bind(this);
        this.mintWithNewHat = this.mintWithNewHat.bind(this);        

        this.redeem = this.redeem.bind(this);
        this.redeemAll = this.redeemAll.bind(this);
        this.redeemAndTransfer = this.redeemAndTransfer.bind(this);
        this.redeemAndTransferAll = this.redeemAndTransferAll.bind(this);
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
        this.setState({ valueOfMintWithNewHatMintAmount: value });  //@dev - Already specified "input type"="number"
    }

    handleInputMintWithNewHatRecipients({ target: { value } }) {
        this.setState({ valueOfMintWithNewHatRecipients: value });
    }

    handleInputMintWithNewHatProportions({ target: { value } }) {
        this.setState({ valueOfMintWithNewHatProportions: Number(value) });
    }

    handleInputRedeemTokens({ target: { value } }) {
        this.setState({ valueOfRedeemTokens: value });  //@dev - Already specified "input type"="number"
    }

    handleInputRedeemAndTransferRedeemTo({ target: { value } }) {
        this.setState({ valueOfRedeemAndTransferRedeemTo: value });
    }

    handleInputRedeemAndTransferRedeemTokens({ target: { value } }) {
        this.setState({ valueOfRedeemAndTransferRedeemTokens: value });  //@dev - Already specified "input type"="number"
    }

    handleInputRedeemAndTransferAllRedeemTo({ target: { value } }) {
        this.setState({ valueOfRedeemAndTransferAllRedeemTo: value });
    }


    rTokenInfo = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;
        let response = await gas_fee_pool.methods.rTokenInfo().call();
        console.log('=== response of rTokenInfo() function ===', response);
    }

    createHatAddRecipients = async () => {
        const { accounts, web3, createHatRecipientsList, valueOfCreateHatRecipients } = this.state;

        //const createHatRecipientsList = [];
        createHatRecipientsList.push(valueOfCreateHatRecipients);
        console.log('=== createHatRecipientsList ===', createHatRecipientsList);

        const _createHatRecipientsList = createHatRecipientsList.map((recipient) => 
            <li>{ recipient }</li>
        );

        this.setState({ valueOfCreateHatRecipients: '', _createHatRecipientsList: _createHatRecipientsList });

        return createHatRecipientsList;
    }

    createHatAddProportions = async () => {
        const { accounts, web3, createHatProportionsList, valueOfCreateHatProportions } = this.state;

        //const createHatProportions = [];
        createHatProportionsList.push(valueOfCreateHatProportions);
        console.log('=== createHatProportionsList ===', createHatProportionsList);

        const _createHatProportionsList = createHatProportionsList.map((proportion) => 
            <li>{ proportion }</li>
        );

        this.setState({ valueOfCreateHatProportions: '', _createHatProportionsList: _createHatProportionsList });

        return createHatProportionsList;
    }

    createHat = async () => {
        const { accounts, web3, gas_fee_pool, createHatRecipientsList, createHatProportionsList } = this.state;

        const _recipients = createHatRecipientsList; 
        //const _recipients = [recipient1, recipient2];
        const _proportions = createHatProportionsList;
        //const _proportions = [70, 30];
        const _doChangeHat = true;
        console.log('=== _recipients ===', _recipients);
        console.log('=== _proportions ===', _proportions);

        let response = await gas_fee_pool.methods._createHat(_recipients, 
                                                                     _proportions, 
                                                                     _doChangeHat).send({ from: accounts[0] })
        console.log('=== response of _createHat() function ===', response);

        this.setState({ createHatRecipientsList: [], 
                        createHatProportionsList: [],
                        _createHatRecipientsList: [],
                        _createHatProportionsList: [] });              
    }

    getHatByID = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        const _hatID = 222;

        let response = await gas_fee_pool.methods._getHatByID(_hatID).call();
        console.log('=== response of _getHatByID() function ===', response);          
    }

    getHatByAddress = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        let response = await gas_fee_pool.methods._getHatByAddress().call();
        console.log('=== response of _getHatByAddress() function ===', response);
    }

    approve = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;    
        //const _spender = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"                    // underlying token (DAI)
        //const _spender = "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB";                   // rDAI-proxy
        //const _spender = contractAddressList["Kovan"]["rtoken-contract"]["rDAI-proxy"];  // rDAI-proxy
        const _amount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）

        let response = await gas_fee_pool.methods._approve(_amount).send({ from: accounts[0] });
        console.log('=== response of _approve() function ===', response);     
    }

    allowance = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        let response = await gas_fee_pool.methods._allowance().call();
        console.log('=== response of _allowance() function ===', response);
    }

    mintWithSelectedHat = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address,  valueOfMintWithSelectedHatMintAmount, valueOfMintWithSelectedHatHatID } = this.state;

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
        const { accounts, web3, mintWithNewHatRecipientsList, valueOfMintWithNewHatRecipients } = this.state;

        mintWithNewHatRecipientsList.push(valueOfMintWithNewHatRecipients);
        console.log('=== mintWithNewHatRecipientsList ===', mintWithNewHatRecipientsList);

        const _mintWithNewHatRecipientsList = mintWithNewHatRecipientsList.map((recipient) => 
            <li>{ recipient }</li>
        );

        this.setState({ valueOfMintWithNewHatRecipients: '', 
                        _mintWithNewHatRecipientsList: _mintWithNewHatRecipientsList });

        return mintWithNewHatRecipientsList;
    }

    mintWithNewHatAddProportions = async () => {
        const { accounts, web3, mintWithNewHatProportionsList, valueOfMintWithNewHatProportions } = this.state;

        mintWithNewHatProportionsList.push(valueOfMintWithNewHatProportions);
        console.log('=== mintWithNewHatProportionsList ===', mintWithNewHatProportionsList);

        const _mintWithNewHatProportionsList = mintWithNewHatProportionsList.map((proportion) => 
            <li>{ proportion }</li>
        );

        this.setState({ valueOfMintWithNewHatProportions: '', 
                        _mintWithNewHatProportionsList: _mintWithNewHatProportionsList });

        return mintWithNewHatProportionsList;
    }

    mintWithNewHat = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address, valueOfMintWithNewHatMintAmount, mintWithNewHatRecipientsList, mintWithNewHatProportionsList } = this.state;

        const _mintAmount = valueOfMintWithNewHatMintAmount;
        //const _mintAmount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        const _recipients = mintWithNewHatRecipientsList;
        //const _recipients = [recipient1, recipient2];
        const _proportions = mintWithNewHatProportionsList;
        //const _proportions = [214748364, 4080218930];

        //@dev - Convert _mintAmount to transferred amount unit
        let decimals = 18;
        let mintAmount = web3.utils.toWei(_mintAmount.toString(), 'ether');

        console.log('=== _recipients ===', _recipients);
        console.log('=== _proportions ===', _proportions);
        console.log('=== mintAmount ===', mintAmount);

        //@dev - Approve and Allowance
        const _spender = rDAI_address;
        let approved = await dai.methods.approve(_spender, mintAmount).send({ from: accounts[0] });
        let allowance = await dai.methods.allowance(accounts[0], _spender).call();
        console.log('=== dai.sol of allowance() function ===', allowance);

        //@dev - Execute mintWithNewHat() function via rDAI.sol
        let response = await rDAI.methods.mintWithNewHat(mintAmount, _recipients, _proportions).send({ from: accounts[0] });
        console.log('=== rDAI.sol of of mintWithNewHat() function ===', response);

        this.setState({ valueOfMintWithNewHatMintAmount: '', 
                        mintWithNewHatRecipientsList: [], 
                        mintWithNewHatProportionsList: [],
                        _mintWithNewHatRecipientsList: [],
                        _mintWithNewHatProportionsList: [] });     
    }

    interestPayableOf = async () => {
        const { accounts, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address, web3 } = this.state;

        const _owner = walletAddressList["addressList"]["address1"];

        let interestPayableOfAmount = await rDAI.methods.interestPayableOf(_owner).call();
        console.log('=== rDAI.sol of interestPayableOf() function ===', interestPayableOfAmount); 
    }

    redeem = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address, valueOfRedeemTokens } = this.state;

        const _redeemTokens = valueOfRedeemTokens;

        //@dev - Transfer DAI from UserWallet to DAI-contract
        let decimals = 18;
        let redeemTokens = web3.utils.toWei(_redeemTokens.toString(), 'ether');
        console.log('=== redeemTokens ===', redeemTokens);
        const _spender = rDAI_address;

        let response = await rDAI.methods.redeem(redeemTokens).send({ from: accounts[0] });
        console.log('=== rDAI.sol of redeem() function ===', response);

        this.setState({ valueOfRedeemTokens: '' });
    }

    redeemAll = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address } = this.state;

        let response = await rDAI.methods.redeemAll().send({ from: accounts[0] });
        console.log('=== rDAI.sol of redeemAll() function ===', response);           
    }

    redeemAndTransfer = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address, valueOfRedeemAndTransferRedeemTo, valueOfRedeemAndTransferRedeemTokens } = this.state;

        const _redeemTo = valueOfRedeemAndTransferRedeemTo;
        const _redeemTokens = valueOfRedeemAndTransferRedeemTokens;

        //@dev - Transfer DAI from UserWallet to DAI-contract
        let decimals = 18;
        let redeemTokens = web3.utils.toWei(_redeemTokens.toString(), 'ether');
        console.log('=== redeemTokens ===', redeemTokens);
        const _spender = rDAI_address;

        let response = await rDAI.methods.redeemAndTransfer(_redeemTo, _redeemTokens).send({ from: accounts[0] });
        console.log('=== rDAI.sol of redeemAndTransfer() function ===', response);           

        this.setState({ valueOfRedeemAndTransferRedeemTo: '', valueOfRedeemAndTransferRedeemTokens: '' });
    }

    redeemAndTransferAll = async () => {
        const { accounts, web3, gas_fee_pool, dai, rDAI, gas_fee_pool_address, rDAI_address, valueOfRedeemAndTransferAllRedeemTo } = this.state;

        const _redeemTo = valueOfRedeemAndTransferAllRedeemTo;

        let response = await rDAI.methods.redeemAndTransferAll(_redeemTo).send({ from: accounts[0] });
        console.log('=== rDAI.sol of redeemAndTransferAll() function ===', response);           

        this.setState({ valueOfRedeemAndTransferAllRedeemTo: '' });
    }


    /***
     * @dev - Hat Status
     **/
    getHatStats = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;
        const _hatID = 222;
        let response = await gas_fee_pool.methods._getHatStats(_hatID).call();
        console.log('=== response of _getHatStats() function ===', response);           
    }

    balanceOf = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        let response = await gas_fee_pool.methods._balanceOf().call();
        console.log('=== response of _balanceOf() function ===', response);               
    }

    underlying = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;
        let response = await gas_fee_pool.methods._underlying().call();
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



    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceGasFeePool) => {
        if (instanceGasFeePool) {
          //console.log('refreshValues of instanceGasFeePool');
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
            let GasFeePoolAddress = GasFeePool.networks[networkId.toString()].address;
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

            //@dev - Create instance of MetaTransactionTest.sol
            let instanceMetaTransactionTest = null;
            if (MetaTransactionTest.networks) {
              deployedNetwork = MetaTransactionTest.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceMetaTransactionTest = new web3.eth.Contract(
                   MetaTransactionTest.abi,
                   deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceMetaTransactionTest ===', instanceMetaTransactionTest);
              }
            }


            if (GasFeePool) {
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
                gas_fee_pool: instanceGasFeePool
              }, () => {
                this.refreshValues(
                  instanceGasFeePool
                );
                setInterval(() => {
                  this.refreshValues(instanceGasFeePool);
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
        const { accounts, 
                gas_fee_pool, 
                _createHatRecipientsList, 
                _createHatProportionsList,
                _mintWithNewHatRecipientsList, 
                _mintWithNewHatProportionsList } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
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
                                </tr>
                                <tr>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.addRelayer}> Add Relayer </Button></td>
                                </tr>
                            </Table>
                            <p>↓</p>
                            <p> Created Relayer Address: ●● </p>
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"1280px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Gas Fee Pool Hat<br />（by using rDAI）</h4>
                            <p>↓</p>
                            <ul>
                                <h4>Example of proportions specification of receivng interest income between recipients</h4>
                                <li>10%: GasFeePool (To RelayerAddress)</li>
                                <li>90%: Owner（To UserAddress）</li>
                            </ul>

                            <hr /> 

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Mint Amount</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Mint Amount" value={this.state.valueOfMintWithNewHatMintAmount} onChange={this.handleInputMintWithNewHatMintAmount} /></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><p>Recipients</p></td>
                                    <td><Input type="text" placeholder="Please input recipients address" value={this.state.valueOfMintWithNewHatRecipients} onChange={this.handleInputMintWithNewHatRecipients} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHatAddRecipients}> Add Recipients </Button></td>
                                    <td>{ _mintWithNewHatRecipientsList }</td>
                                </tr>
                                <tr>
                                    <td><p>Proportions</p></td>
                                    <td><Input type="text" placeholder="Please input proportions" value={this.state.valueOfMintWithNewHatProportions} onChange={this.handleInputMintWithNewHatProportions} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHatAddProportions}> Add Proportions </Button></td>
                                    <td>{ _mintWithNewHatProportionsList }</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHat}> Mint With New Hat </Button></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <p>↓</p>

                            <p> Created Hat ID: ●● </p>

                            <p>↓</p>

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.interestPayableOf}> Interest Payable Of </Button> <br />

                            <h4>↓</h4> 

                            <Table>
                                <tr>
                                    <td><p>Redeem To</p></td>
                                    <td><Input type="text" placeholder="Please input Redeem To" value={this.state.valueOfRedeemAndTransferAllRedeemTo} onChange={this.handleInputRedeemAndTransferAllRedeemTo} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransferAll}> Redeem And Transfer All </Button></td>
                                    <td></td>
                                </tr>
                            </Table>
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"1280px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Read Functions of Relayer</h4>
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getAllRelayers}> Get All Relayers </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getRelayerStatus}> Get Relayer Status </Button> <br />

                            <hr />

                            <br />
                            <h4>Read Functions of rDAI</h4>
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
                            <h4>Other Write Functions</h4>

                            <Table>
                                <tr>
                                    <td><p>Recipients</p></td>
                                    <td><Input type="text" placeholder="Please input recipients address" value={this.state.valueOfCreateHatRecipients} onChange={this.handleInputCreateHatRecipients} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHatAddRecipients}> Add Recipients </Button></td>
                                    <td>{ _createHatRecipientsList }</td>
                                </tr>
                                <tr>
                                    <td><p>Proportions</p></td>
                                    <td><Input type="text" placeholder="Please input proportions" value={this.state.valueOfCreateHatProportions} onChange={this.handleInputCreateHatProportions} /></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHatAddProportions}> Add Proportions </Button></td>
                                    <td>{ _createHatProportionsList }</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.createHat}> Create Hat </Button></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Mint Amount</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Mint Amount" value={this.state.valueOfMintWithSelectedHatMintAmount} onChange={this.handleInputMintWithSelectedHatMintAmount} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><p>Hat ID</p></td>
                                    <td><Input type="text" placeholder="Please input Hat ID" value={this.state.valueOfMintWithSelectedHatHatID} onChange={this.handleInputMintWithSelectedHatHatID} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.mintWithSelectedHat}> Mint With Selected Hat </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Redeem Tokens（Amount）</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Redeem Tokens（Amount）" value={this.state.valueOfRedeemTokens} onChange={this.handleInputRedeemTokens} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.redeem}> Redeem </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.redeemAll}> Redeem All </Button></td>
                                    <td></td>
                                </tr>
                            </Table>

                            <br />

                            <Table>
                                <tr>
                                    <td><p>Redeem To</p></td>
                                    <td><Input type="text" placeholder="Please input Redeem To" value={this.state.valueOfRedeemAndTransferRedeemTo} onChange={this.handleInputRedeemAndTransferRedeemTo} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><p>Redeem Tokens（Amount）</p></td>
                                    <td><Input type="number" step="0.01" placeholder="Please input Redeem Tokens（Amount）" value={this.state.valueOfRedeemAndTransferRedeemTokens} onChange={this.handleInputRedeemAndTransferRedeemTokens} /></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransfer}> Redeem And Transfer </Button></td>
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
