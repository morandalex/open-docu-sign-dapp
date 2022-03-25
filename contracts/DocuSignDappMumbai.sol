// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
contract PriceOracle {

    AggregatorV3Interface internal priceFeed;

    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }


    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}
contract BuySignedIpfsCid is Initializable, OwnableUpgradeable {

    using SafeMath for uint256;
    using Address for address; 
    PriceOracle private MaticUsdOracle;
    uint256 public VolatilityBarrierPercentage;
    mapping(string => int) public Prices;
    
    bool public CashierClosed;


    event Registerd(bytes32 hash, string description, address signer);
    event Bought(address addr, string product,uint docsOrdered);
    event ProductAdded(string name, int price);
    event ProductPriceChanged(string name, int price);
    event ProductRemoved(string name);
    event Transfer(address to, uint256 amount, bool sent, bytes callData);

    uint count = 0;


   
    struct Document {
        uint timestamp;
        string ipfs_hash;
        address[] signatures;
    }
   
    struct SignaturesByUser {
        string id;
        string ipfs_hash;
        uint timestamp;
      
    }

    constructor() initializer
    {
        initialize();
    }

    function initialize() public initializer {
        __Ownable_init();
        //MaticUsdOracle = new PriceOracle(0xAB594600376Ec9fD91F8e885dADF0CE036862dE0); // Poligon Mainnet        
        MaticUsdOracle = new PriceOracle(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada); // Poligon MUMBAI 
        VolatilityBarrierPercentage = 99;
        CashierClosed = false;
    }


    

    mapping(uint => Document) public documents; 
   
    mapping(address =>  SignaturesByUser[]) public users; 

    mapping(address => uint) public signAllowance;

     mapping(address => uint) public countSigns;

    function addDocument(string memory _id, string memory _cid) public {

        require (
            signAllowance[msg.sender] >0 ,
            "Is not allowed the user to sign"
            ); 
        require ( 
            countSigns[msg.sender] <4,
            "Is not allowed the user to sign"
        );
        
        countSigns[msg.sender] = countSigns[msg.sender]+1;

        signAllowance[msg.sender] = signAllowance[msg.sender]-1;
        
        //memorizza che documenti ha firmato l'utente
        users[msg.sender].push( SignaturesByUser(_id,_cid,block.timestamp));

        //memorizza chi ga firmato il tipo documento
        address[] memory sender = new address[](1);
        sender[0] = msg.sender;
        count ++;
        documents[count] = Document(block.timestamp, _cid, sender);

       
    
    }


    function registerOnBehalfOf(bytes32 hash, string memory id, string memory cid,address signer, uint8 v, bytes32 r, bytes32 s) public {

       
        bytes32 payloadHash = keccak256(abi.encode(hash, id));

        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadHash));

        address actualSigner = ecrecover(messageHash, v, r, s);

        require(signer == actualSigner, "invalid signature");
        
        addDocument( id,  cid);
        _register(hash, id, actualSigner);
    
    }

    function _register(bytes32 hash, string memory id, address signer) public {
    emit Registerd(hash, id, signer);

    }


    function getSignatures(uint  num) public view returns (Document memory ) {
            return documents[num];
    }

    function getDocSignedByUsers() public view returns (SignaturesByUser[] memory ) {
            return users[msg.sender];
    }

    function CloseCashier() public onlyOwner
    {
        CashierClosed = true;
    }
    function ChangeVolatilityBarrier(uint256 value) public onlyOwner 
    {
        VolatilityBarrierPercentage = value;
    }

    function AddProduct(string memory name, int price) public onlyOwner
    {
        require(Prices[name]== 0, "Product Already Exist!");
        Prices[name] = price;
        emit ProductAdded(name,price);
    }
    function RemoveProduct(string memory name) public onlyOwner
    {
        require(Prices[name]!= 0, "Product Not Exist!");
        Prices[name] = 0;
        emit ProductRemoved(name);
    }

    function ChangeProductPrice(string memory name, int price) public onlyOwner
    {
        require(Prices[name]!= 0, "Product Not Exist!");
        Prices[name] = price;
        emit ProductPriceChanged(name, price);
    }


    function GetMaticUsd() public view  returns (int)
    {
        return MaticUsdOracle.getLatestPrice();
    }


    function GetProductPriceInWei(string memory name) public view returns(int)
    {
        require(Prices[name] != 0, "Product Not Found");
        return ((Prices[name]) * 10**18 * 10**8 /GetMaticUsd());
    }

    function Buy(string memory name) public payable
    {
        require(CashierClosed == false, "Cashier is closed and will not available anymore");
        require(msg.value >= uint256(GetProductPriceInWei(name)) *VolatilityBarrierPercentage / 100, "Volatility to high");       
        emit Bought(msg.sender,name,0);

    }
    function BuySignService(string memory name,uint docsOrdered) public payable
    {
        require(CashierClosed == false, "Cashier is closed and will not available anymore");
        require((msg.value >= uint256(GetProductPriceInWei(name)) * docsOrdered * VolatilityBarrierPercentage  / 100 ) , "Volatility to high");       
        require (keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked("SIGN")),"You have to select the sign service product");
        signAllowance[msg.sender] = signAllowance[msg.sender]+docsOrdered;
        emit Bought(msg.sender,name,docsOrdered);

    }
    function TransferFunds() public onlyOwner
    {
        require (address(this).balance>0,"the balance has to be > 0");
        payable(msg.sender).transfer(address(this).balance);
              
    }

}