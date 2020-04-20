pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// DAI
import "./DAI/dai.sol";

// Mexa
import "./mexa/contracts/RelayHub.sol";
//import "./mexa/contracts/RelayerManager.sol";


/***
 * @notice - This contract is that ...
 **/
contract GasFeePool is Ownable, McStorage, McConstants {
    using SafeMath for uint;

    Dai public dai;  //@dev - dai.sol
    IERC20 public erc20;
    RelayHub public relayHub;
    //RelayerManager public relayerManager;

    constructor(address _erc20, address _relayHub) public {
        dai = Dai(_erc20);
        erc20 = IERC20(_erc20);

        relayHub = RelayHub(_relayHub);
        //relayerManager = RelayerManager(_relayerManager);
    }

    /***
     * @dev - Biconomy RelayerManager.sol
     **/
    function ownerOfRelayerManager() public view returns (address _owner) {
        return relayHub.owner();
    }
    
}
