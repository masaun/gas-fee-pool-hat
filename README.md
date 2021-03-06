# Gas Fee Pool Hat

## 【Introduction of Gas Fee Pool Hat】
- Gas Fee Pool Hat is that gas fee is paid by relayer instead of users by utilizing rDAI and Biconomy.
  - Amount that relayer pay for gas fee is provided from interest income via rDAI.
  - Users generate `Interest income` via specific Hat of `rDAI`
  - Users are staking `generated "interest income"` into `Gas Fee Pool Hat` .
  - Users can pay `"Gas Fee" of users` with `generated "interest income"` instead of users. 
    - This structure is realized by `"Meta-Transaction"` by using `Biconomy` . 

&nbsp;

## 【User Flow】
### _[User Flow Guide of Gas Fee Pool Hat]_
https://medium.com/@masanoriuno_75621/user-flow-guide-of-gas-fee-pool-hat-bfb713f3fcbc

<br>

### _[User Flow (briefly)]_
- ① Register `Relayer Address` 
    (※ Attention: allow onlyOwner address to execute this function. So that you need to specify `owner address` before you execute migrate：https://github.com/masaun/gas-fee-pool/blob/master/migrations/2_deploy_mexa.js#L9 )

<br>

- ② Create `new Hat` for gas-fee-pool (=Called `"gas fee pool Hat"` ) 
  - At that time, user specify proportions between user's wallet address and registered `Relayer Address`
  - By specifying above, generated interest will be pooled into gas-fee-pool-Hat every time which interest are generated. 
    (Pooled amount into gas-fee-pool-Hat is amount that proportion is specified)

<br>

- ③ Redeem & Transfer (from `"gas fee pool Hat"` to `"RelayerAddress"` )


<br>

- ④ Execute test function (Push a button of "Set Text" in the page of "Mete-Transaction")
  - At the same time with executing this function, Gas Fee is paid by registered relayer via meta-transaction of Biconomy.
    (Registered relayer pay with pooled interest income for gas fee which happen by executing test function)


&nbsp;


***

## 【Setup】
### Versions / Environment
```
$ truffle versions

  - Truffle v5.1.23 (core: 5.1.23)
  - Solidity v0.5.16 (solc-js)
  - Node v12.13.0
  - Web3.js v1.2.1
```

<br>


### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
Kovan Test Network
```

&nbsp;


### Setup backend
1. Deploy contracts to Kovan Test Network
```
(root directory)

$ npm run migrate:Kovan
```

&nbsp;


### Setup frontend
1. Add an `.env` file under the directory of `./client`.

2. Add `SKIP_PREFLIGHT_CHECK=true` to an `.env` file under the directory of `./client`.  
（Recommend to reference from `./client/.env.example`）

3. Execute command below in root directory.
```
$ npm run client
```

4. Access to browser by using link 
```
http://127.0.0.1:3000/gas-fee-pool
```

&nbsp;

***

## 【References】
- [rDAI]
  - [MetaCartel - Dragon Quest]
    - Best rDAI Integration or Tool  
      https://explorer.bounties.network/bounty/3921

  - [rDAI / Tutorial]
    - rDAI Basics: A Tutorial on Programming Interest with DeFi  
      https://medium.com/@victorrortvedt/rdai-basics-a-tutorial-on-programming-interest-with-defi-458baab9477a

  - rtoken-contracts：  
    https://github.com/rtoken-project/rtoken-contracts 

  - rDAI explorer：  
    https://explorer.rdai.money

  - Video of rDAI with eth.build  
    https://www.youtube.com/watch?v=nEC2kadoLms

  - [Use Case]：Existing dApp（Dapps built on rDAI include）  
	https://app.rdai.money
	https://rtrees.dappy.dev
	https://highpriests.rdai.money

<br>


- [Biconomy]
  - [Money Legos A Global Online DeFi Hackathon]  
    https://moneylegos.devfolio.co/#prizes


  - [Repos]
	- SmartContract / Mexa  
	  https://github.com/bcnmy/mexa

	- Mexa-SDK  
	  https://github.com/bcnmy/mexa-sdk

	- Mexa Example Projects  
	  https://github.com/bcnmy/mexa-examples
