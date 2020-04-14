pragma solidity ^0.5.11;

import "./McObjects.sol";


contract McEvents {

    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        uint256 approvedValue
    );

}
