pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// DAI
import "./DAI/dai.sol";

// Meta Transaction
import "./metatx-standard/contracts/EIP712MetaTransaction.sol";


/***
 * @notice - This contract is that ...
 **/
contract GasFeePool is McStorage, McConstants, EIP712MetaTransaction("GasFeePool","1") {
    using SafeMath for uint;

    Dai public dai;  //@dev - dai.sol
    IERC20 public erc20;

    constructor(address _erc20) public {
        dai = Dai(_erc20);
        erc20 = IERC20(_erc20);
    }


    /***
     * @dev - Execute Meta-Transaction
     **/
    function executeMetaTransactionTest(string memory _newText) 
        public 
        returns (string memory _currentText, address _currentOwner) 
    {
        setText(_newText);
        return getText();
    }


    /***
     * @dev - Internal function for executing Meta-Transaction
     **/
    string public text;
    address public owner;

    function setText(string memory newText) public {
        text = newText;
        owner = msgRelayer();
        //owner = msgSender();
    }

    function getText() view public returns (string memory _currentText, address _currentOwner) {
        string memory currentText = text;
        address currentOwner = owner;

        return (currentText, currentOwner);
    }
    
}
