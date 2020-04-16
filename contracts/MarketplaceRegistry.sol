pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// rDAI
//import "./rtoken-contracts/contracts/IRToken.sol";
import "./rtoken-contracts/contracts/tokens/rDAI.sol";
//import "./rtoken-contracts/contracts/RToken.sol";
//import "./rtoken-contracts/contracts/IRToken.sol";
import "./rtoken-contracts/contracts/IAllocationStrategy.sol";
import "./rtoken-contracts/contracts/RTokenStructs.sol";


/***
 * @notice - This contract is that ...
 **/
contract MarketplaceRegistry is Ownable, McStorage, McConstants {
    using SafeMath for uint;

    address _ias;  //@dev - _ias is from rDAI.sol
    address underlyingERC20;
    address rDaiAddress;
    address rTokenAddress;

    IERC20 public erc20;
    //RToken public rToken;
    //IRToken public rToken;
    rDAI public rDai;
    IAllocationStrategy public allocationStrategy;

    constructor(address _erc20, address _rDai, address _rToken, address _allocationStrategy) public {
        erc20 = IERC20(_erc20);
        rDai = rDAI(_rDai);           //@dev - Assign rDAI-Proxy address into rDAI.sol
        //rToken = RToken(_rDai);     //@dev - Assign rDAI-Proxy address into RToken.sol
        //rToken = IRToken(_rDai);    //@dev - Assign rDAI-Proxy address into IRToken.sol
        //rToken = IRToken(_rToken);
        //allocationStrategy = IAllocationStrategy(_allocationStrategy);

        underlyingERC20 = _erc20;
        rDaiAddress = _rDai;
        rTokenAddress = _rToken;

        _ias = rDai.getCurrentSavingStrategy();
        allocationStrategy = IAllocationStrategy(_ias);
    }

    function testFunc(uint256 _mintAmount) public returns (bool, uint256 _approvedValue) {
        uint256 _id = 1;
        uint256 _exchangeRateCurrent = McConstants.onePercent;

        address _to = 0x8Fc9d07b1B9542A71C4ba1702Cd230E160af6EB3;

        address _owner = address(this); //@dev - contract address which do delegate call
        //address _owner = msg.sender;
        address _spender = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;    // DAI address on Kovan
        //address _spender = 0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB;  // rDAI-proxy

        //@dev - Allow _spender to withdraw from your account, multiple times, up to the _value amount. 
        erc20.approve(_spender, _mintAmount.mul(10**18));
            
        //@dev - Returns the amount which _spender is still allowed to withdraw from _owner
        uint256 _approvedValue = erc20.allowance(_owner, _spender);
        
        //@dev - Expected transferred value is 1.05 DAI（= 1050000000000000000 Wei）
        erc20.transfer(_to, _mintAmount.mul(10**18).div(10**2));        

        emit Example(_id, _exchangeRateCurrent, _approvedValue);

        return (McConstants.CONFIRMED, _approvedValue);
    }

    function balanceOfCurrentAccount(address _currentAccount) public view returns (uint256 balanceOfCurrentAccount) {
        return erc20.balanceOf(_currentAccount);
    }
    

    function transferEtherToContract() public payable returns (bool) {
        //@dev - Transfer ether from caller's address to contract
        uint256 etherAmount = msg.value;
        address(uint160(address(this))).transfer(etherAmount.div(10**1));
    }
    


    function rTokenInfo() public view returns (string memory _name, string memory _symbol, uint256 _decimals) {
        //return (rToken.name(), rToken.symbol(), rToken.decimals());
        return (rDai.name(), rDai.symbol(), rDai.decimals());
    }

    function _createHat(
        address[] memory _recipients,
        uint32[] memory _proportions,
        bool _doChangeHat
    ) public returns (uint256 _hatID) {
        //uint256 _hatID = rToken.createHat(_recipients, _proportions, _doChangeHat);
        uint256 _hatID = rDai.createHat(_recipients, _proportions, _doChangeHat);
        
        emit CreateHat(_hatID);

        return _hatID;
    }

    function _getHatByID(uint256 _hatID)
        public
        view
        returns (address[] memory _recipients, uint32[] memory _proportions) {
        
        //return rToken.getHatByID(_hatID);
        return rDai.getHatByID(_hatID);
    }

    function _getHatByAddress()
        public
        view
        returns (
            uint256 _hatID,
            address[] memory _recipients,
            uint32[] memory _proportions
        ) {
        address _owner = address(this);    //@dev - contract address which do delegate call
        //rToken.getHatByAddress(_owner);
        rDai.getHatByAddress(_owner);
    }
    

    function _approve(uint256 _amount) public returns (bool) {
        address _spenderUnderlyingERC20 = underlyingERC20;  // DAI address on kovan ("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"). 
        address _spenderRDai = rDaiAddress;
        address _spender = address(this);

        //@dev - contract address which do delegate access to current user's asset
        erc20.approve(_spender, _amount.mul(10**18));      //@dev - Allow contract which does delegate call of rDAI to access DAI 
        erc20.approve(_spenderUnderlyingERC20, _amount.mul(10**18));
        erc20.approve(_spenderRDai, _amount.mul(10**18));  //@dev - Allow rDAI to access DAI 

        rDai.approve(_spender, _amount.mul(10**18));
        rDai.approve(_spenderUnderlyingERC20, _amount.mul(10**18));
        rDai.approve(_spenderRDai, _amount.mul(10**18));

        //@dev - transfer DAI from this contract to rDAI address;
        erc20.transfer(_spenderRDai, _amount.mul(10**18).div(10**2));
        emit TransferDaiToRDai(_spenderRDai, _amount.mul(10**18));
    }
    
    function _allowance() 
        public 
        view 
        returns (uint256 rDaiAllowance,
                 uint256 underlyingERC20Allowance, 
                 uint256 rDAI_and_UnderlyingERC20_Allowance) 
    {
        //@dev - contract address which do delegate access to current user's asset
        address _owner = address(this);      //@dev - contract address which do delegate call
        address _spenderRDai = rDaiAddress;
        address _spenderUnderlyingERC20 = underlyingERC20;  // DAI address on kovan ("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa")
        address _spender = address(this);

        //return rToken.allowance(_owner, _spender);
        return (rDai.allowance(_owner, _spenderRDai),                     
                erc20.allowance(_owner, _spenderUnderlyingERC20),
                erc20.allowance(_spenderUnderlyingERC20, _spenderRDai));  //@dev - Allow rDAI to access DAI
    }

    function _mintWithSelectedHat(uint256 _mintAmount, uint256 _hatID) public returns (bool) {
        //@dev - Need to call by uint256. So that put ".mul(10**18)" only. Don't put ".div(10**2)"
        //rToken.mintWithSelectedHat(_mintAmount.mul(10**18), _hatID);
        rDai.mintWithSelectedHat(_mintAmount.mul(10**18), _hatID);
    }
    
    function _mintWithNewHat(
        uint256 _mintAmount,
        address[] memory _recipients,
        uint32[] memory _proportions
    ) public returns (bool) {
        //@dev - Need to call by uint256. So that put ".mul(10**18)" only. Don't put ".div(10**2)"
        //rToken.mintWithNewHat(_mintAmount.mul(10**18), _recipients, _proportions);
        rDai.mintWithNewHat(_mintAmount.mul(10**18), _recipients, _proportions);
    }
    
    function _interestPayableOf() public view returns (uint256 _amount) {
        address _owner = address(this);  //@dev - contract address which do delegate call
        //return rToken.interestPayableOf(_owner);
        return rDai.interestPayableOf(_owner);
    }

    function _redeem(uint256 _redeemTokens) public returns (bool) {
        //rToken.redeem(_redeemTokens);
        rDai.redeem(_redeemTokens);
    }
    
    function _redeemAll() public returns (bool) {
        //rToken.redeemAll();
        rDai.redeemAll();
    }

    function _redeemAndTransfer(address _redeemTo, uint256 _redeemTokens) public returns (bool) {
        //rToken.redeemAndTransfer(_redeemTo, _redeemTokens);
        rDai.redeemAndTransfer(_redeemTo, _redeemTokens);
    }
    
    function _redeemAndTransferAll(address _redeemTo) public returns (bool) {
        //rToken.redeemAndTransferAll(_redeemTo);
        rDai.redeemAndTransferAll(_redeemTo);
    }
    
    
    /***
     * @dev - Hat Status
     **/
    function _getHatStats(uint256 _hatID) public view returns (RTokenStructs.HatStatsView memory _stats) {
        //return rToken.getHatStats(_hatID);
        return rDai.getHatStats(_hatID);
    }

    function _balanceOf() public view returns (uint256 _balanceOfSpecifiedAccountAddress) {
        address _owner = address(this); //@dev - contract address which do delegate call
        //return rToken.balanceOf(_owner);
        return rDai.balanceOf(_owner);
    }
    

    /**
     * @notice Underlying asset for the strategy
     * @return address Underlying asset address
     */
    function _underlying() public view returns (address _underlyingAssetAddress) {
        //return rToken.underlying();
        //return rDai.underlying();
        return allocationStrategy.underlying();
    }
    
    
}
