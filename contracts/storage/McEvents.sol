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


    event _TransferFrom(
        address from,
        address to,
        uint256 transferredAmount,
        uint256 allowanceAmount
    );


    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        address msgSender,
        uint256 approvedValue    
    );

}
