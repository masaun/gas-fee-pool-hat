# Gas Fee Pool

***
## 【Introduction of Gas Fee Pool】
- Gas Fee Pool is for `Service Providers` on ethereum.
  - Service Providers generate `Interest income` by using `rDAI`
  - Service Providers staking `generated "interest income"` into `Gas Fee Pool` .
  - Service Providers can pay `"Gas Fee" of users` with `generated "interest income"` instead of users. 
    - This structure is realized by `"Meta-Transaction"` by using `Biconomy` . 

&nbsp;

***

## 【Setup】
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
1. Execute command below in root directory.
```
$ npm run client
```

2. Access to browser by using link 
```
http://127.0.0.1:3000/gas-fee-pool
```

&nbsp;

***


## 【Work flow】

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
