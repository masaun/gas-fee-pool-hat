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
import "./rtoken-contracts/contracts/IRToken.sol";


/***
 * @notice - This contract is that ...
 **/
contract MarketplaceRegistry is Ownable, McStorage, McConstants {
    using SafeMath for uint;

    //address _erc20 = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;  // DAI address on Kovan;

    IERC20 public erc20;
    IRToken public rToken;

    constructor(address _erc20, address _rToken) public {
        erc20 = IERC20(_erc20);
        rToken = IRToken(_rToken);
    }

    function testFunc() public returns (bool) {
        uint256 _id = 1;
        uint256 _exchangeRateCurrent = McConstants.onePercent;

        address _to = 0x8Fc9d07b1B9542A71C4ba1702Cd230E160af6EB3;
        uint256 _amount = 1;

        erc20.transfer(_to, _amount.div(10**1));        

        emit Example(_id, _exchangeRateCurrent);

        return McConstants.CONFIRMED;
    }


    function rTokenInfo() public view returns (string memory _name, string memory _symbol, uint256 _decimals) {
        return (rToken.name(), rToken.symbol(), rToken.decimals());
    }

    function _createHat(
        address[] memory _recipients,
        uint32[] memory _proportions,
        bool _doChangeHat
    ) public returns (uint256 _hatID) {
        uint256 _hatID = rToken.createHat(_recipients, _proportions, _doChangeHat);
        return _hatID;
    }

    function _getHatByID(uint256 _hatID)
        public
        view
        returns (address[] memory _recipients, uint32[] memory _proportions) {
        return rToken.getHatByID(_hatID);
    }

    function _approve(address _spender, uint256 _amount) public returns (bool) {
        //@dev- IRToken.sol inherit IERC20.sol (So that instance of IRToken.sol can access to approve function)
        rToken.approve(_spender, _amount.div(10**18));
    }
    
    function _mintWithSelectedHat(uint256 _mintAmount, uint256 _hatID) public returns (bool) {
        rToken.mintWithSelectedHat(_mintAmount.div(10**18), _hatID);
    }
    
}
