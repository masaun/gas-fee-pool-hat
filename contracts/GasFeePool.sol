pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

// Storage
import "./storage/GpStorage.sol";
import "./storage/GpConstants.sol";

// rDAI
import "./rtoken-contracts/contracts/tokens/rDAI.sol";
import "./rtoken-contracts/contracts/IAllocationStrategy.sol";
import "./rtoken-contracts/contracts/RTokenStructs.sol";

// DAI
import "./DAI/dai.sol";


/***
 * @notice - This contract is that ...
 **/
contract GasFeePool is Ownable, GpStorage, GpConstants {
    using SafeMath for uint;

    address _ias;  //@dev - _ias is from rDAI.sol
    address underlyingERC20;
    address rDaiAddress;
    address rTokenAddress;

    Dai public dai;  //@dev - dai.sol
    IERC20 public erc20;
    rDAI public rDai;
    IAllocationStrategy public allocationStrategy;


    constructor(address _erc20, address _rDai, address _rToken, address _allocationStrategy, address _relayerManager) public {
        dai = Dai(_erc20);

        erc20 = IERC20(_erc20);
        rDai = rDAI(_rDai); //@dev - Assign rDAI-Proxy address into rDAI.sol

        underlyingERC20 = _erc20;
        rDaiAddress = _rDai;
        rTokenAddress = _rToken;

        _ias = rDai.getCurrentSavingStrategy();
        allocationStrategy = IAllocationStrategy(_ias);
    }


    function rTokenInfo() public view returns (string memory _name, string memory _symbol, uint256 _decimals) {
        return (rDai.name(), rDai.symbol(), rDai.decimals());
    }

    function _createHat(
        address[] memory _recipients,
        uint32[] memory _proportions,
        bool _doChangeHat
    ) public returns (uint256 _hatID) {
        uint256 _hatID = rDai.createHat(_recipients, _proportions, _doChangeHat);
        
        emit CreateHat(_hatID);

        return _hatID;
    }

    function _getHatByID(uint256 _hatID)
        public
        view
        returns (address[] memory _recipients, uint32[] memory _proportions) {
        
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
        rDai.getHatByAddress(_owner);
    }
    

    function _approve(uint256 _amount) public returns (bool) {
        address _spenderUnderlyingERC20 = underlyingERC20;  // DAI address on kovan ("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"). 
        address _spenderRDai = rDaiAddress;
        address _spender = address(this);

        erc20.approve(_spenderRDai, _amount.mul(10**18));  //@dev - Allow rDAI to access DAI 

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
        address _spenderUnderlyingERC20 = underlyingERC20;  // DAI address on kovan ("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"). 
        address _spenderRDai = rDaiAddress;
        address _spender = address(this);
        address _msgSender = msg.sender;

        //@dev - Approve rDAI for DAI
        dai.approve(_spenderRDai, _mintAmount.mul(10**18));  //@dev - Allow rDAI to access DAI 
        dai.approve(_spender, _mintAmount.mul(10**18));  //@dev - Allow rDAI to access DAI

        //@dev - Need to call by uint256. So that put ".mul(10**18)" only. Don't put ".div(10**2)"
        rDai.mintWithSelectedHat(_mintAmount.mul(10**18), _hatID);
    }
    
    function _mintWithNewHat(
        uint256 _mintAmount,
        address[] memory _recipients,
        uint32[] memory _proportions
    ) public returns (bool) {
        //@dev - Need to call by uint256. So that put ".mul(10**18)" only. Don't put ".div(10**2)"
        rDai.mintWithNewHat(_mintAmount.mul(10**18), _recipients, _proportions);
    }
    
    function _interestPayableOf() public view returns (uint256 _amount) {
        address _owner = address(this);  //@dev - contract address which do delegate call
        return rDai.interestPayableOf(_owner);
    }

    function _redeem(uint256 _redeemTokens) public returns (bool) {
        rDai.redeem(_redeemTokens);
    }
    
    function _redeemAll() public returns (bool) {
        rDai.redeemAll();
    }

    function _redeemAndTransfer(address _redeemTo, uint256 _redeemTokens) public returns (bool) {
        rDai.redeemAndTransfer(_redeemTo, _redeemTokens);
    }
    
    function _redeemAndTransferAll(address _redeemTo) public returns (bool) {
        rDai.redeemAndTransferAll(_redeemTo);
    }
    
    
    /***
     * @dev - Hat Status
     **/
    function _getHatStats(uint256 _hatID) public view returns (RTokenStructs.HatStatsView memory _stats) {
        return rDai.getHatStats(_hatID);
    }

    function _balanceOf() public view returns (uint256 _balanceOfSpecifiedAccountAddress) {
        address _owner = address(this); //@dev - contract address which do delegate call
        return rDai.balanceOf(_owner);
    }
    

    /**
     * @notice Underlying asset for the strategy
     * @return address Underlying asset address
     */
    function _underlying() public view returns (address _underlyingAssetAddress) {
        return allocationStrategy.underlying();
    }

}
