pragma solidity ^0.5.11;

import "./McObjects.sol";


contract McEvents {

    event CreateHat(
        uint256 hatID
    );


    event TransferDaiToRDai(
        address transferToAddress,
        uint256 transferredAmount
    );


    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        uint256 approvedValue    
    );

}
