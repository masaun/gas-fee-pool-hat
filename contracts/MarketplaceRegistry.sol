pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";



/***
 * @notice - This contract is that ...
 **/
contract MarketplaceRegistry is Ownable, McStorage, McConstants {
    using SafeMath for uint;

    //address _erc20 = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;  // DAI address on Kovan;

    IERC20 public erc20;

    constructor(address _erc20) public {
        erc20 = IERC20(_erc20);
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

}
