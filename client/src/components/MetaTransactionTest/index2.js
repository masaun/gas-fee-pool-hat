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

        this.executeMetaTransactionTest = this.executeMetaTransactionTest.bind(this);
    }

    executeMetaTransactionTest = async () => {
        const { accounts, gas_fee_pool, web3 } = this.state;

        const _newQuote = "Write new quote for Test Meta-Transaction";
        let response = await gas_fee_pool.methods.executeMetaTransactionTest(_newQuote).send({ from: accounts[0] });
        console.log('=== response of executeMetaTransactionTest() ===', response);
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
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Meta-Transaction Test</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.executeMetaTransactionTest}> Execute Meta-Transaction Test </Button> <br />
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
