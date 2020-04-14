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
            route: window.location.pathname.replace("/", "")
        };

        this.getTestData = this.getTestData.bind(this);
    }

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

    transferEtherToContract = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods.transferEtherToContract().send({ from: accounts[0], value: 100000000000000000 });  // wei
        console.log('=== response of transferEtherToContract() function ===', response);
    }

    rTokenInfo = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;
        let response = await marketplace_registry.methods.rTokenInfo().call();
        console.log('=== response of rTokenInfo() function ===', response);
    }

    createHat = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;
        console.log('=== accounts ===', accounts);

        //const recipient1 = accounts[0];
        const recipient1 = walletAddressList["addressList"]["address1"];
        //const recipient2 = "0x8Fc9d07b1B9542A71C4ba1702Cd230E160af6EB3";
        const recipient2 = walletAddressList["addressList"]["address2"];

        const _recipients = [recipient1, recipient2];
        //const _recipients = [accounts[0], accounts[1]]; 
        const _proportions = [70, 30];
        const _doChangeHat = true;

        let response = await marketplace_registry.methods._createHat(_recipients, 
                                                                     _proportions, 
                                                                     _doChangeHat).send({ from: accounts[0] })
        console.log('=== response of _createHat() function ===', response);                
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
        const { accounts, marketplace_registry, web3 } = this.state;

        const _mintAmount = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        const _hatID = 222;

        let response = await marketplace_registry.methods._mintWithSelectedHat(_mintAmount, _hatID).send({ from: accounts[0] });
        console.log('=== response of _mintWithSelectedHat() function ===', response);     
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
        const { accounts, marketplace_registry, web3 } = this.state;

        let response = await marketplace_registry.methods._interestPayableOf().call();
        console.log('=== response of _interestPayableOf() function ===', response);   
    }

    redeem = async () => {
        const { accounts, marketplace_registry, web3 } = this.state;

        const _redeemTokens = 105;  // Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）

        let response = await marketplace_registry.methods._redeem(_redeemTokens).send({ from: accounts[0] });
        console.log('=== response of _redeem() function ===', response);           
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
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let MarketplaceRegistry = {};
        try {
          MarketplaceRegistry = require("../../../../build/contracts/MarketplaceRegistry.json");          // Load artifact-file of MarketplaceRegistry
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
                marketplace_registry: instanceMarketplaceRegistry
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
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Gas Fee Pool Hat<br />（by using rDAI）</h4> <br />
                            <h4>↓</h4> <br />
                            <h4>Proportions<br />10%: GasFeePool<br />90%: Owner</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.getTestData}> Get Test Data </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.transferEtherToContract}> transfer Ether To Contract </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.rTokenInfo}> rToken Info </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.createHat}> Create Hat </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.getHatByID}> Get Hat By ID </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.getHatByAddress}> Get Hat By Address </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.approve}> Approve rDAI Proxy Contract </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.allowance}> Allowance rDAI Proxy Contract </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.mintWithSelectedHat}> Mint With Selected Hat </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.mintWithNewHat}> Mint With New Hat </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.interestPayableOf}> Interest Payable Of </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeem}> Redeem </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAll}> Redeem All </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransfer}> Redeem And Transfer </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.redeemAndTransferAll}> Redeem And Transfer All </Button> <br />

                            <hr />

                            <Button size={'small'} mt={3} mb={2} onClick={this.getHatStats}> Get Hat Stats </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.balanceOf}> Balance Of </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.underlying}> Underlying Asset Address </Button> <br />
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
