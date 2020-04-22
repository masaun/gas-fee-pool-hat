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
    function executeMetaTransactionTest(string memory _newQuote) 
        public 
        returns (string memory _currentQuote, address _currentOwner) 
    {
        setQuote(_newQuote);
        return getQuote();
    }


    /***
     * @dev - Internal function for executing Meta-Transaction
     **/
    string public quote;
    address public owner;

    function setQuote(string memory newQuote) public {
        quote = newQuote;
        owner = msgRelayer();
        //owner = msgSender();
    }

    function getQuote() view public returns(string memory currentQuote, address currentOwner) {
        currentQuote = quote;
        currentOwner = owner;
    }
    
}
