pragma solidity = 0.5.0;

import "./IERC20.sol";
import "../Registry/IRegistry.sol";
import "../Admin/IAdmin.sol";
import "./IFundingVault.sol";

contract FundingVault is IFundingVault {
    // The live instance of the admin contract
    IAdmin private _adminContract;
    // The live instance of the registry contract
    IRegistry private _registryContract;
    // The ERC20 colalteral token 
    IERC20 private _collateralContract;

    /**
      * @dev Sets the address of the admin contract and the collateral
      */
    constructor(address _admin, address _collateral) public {
        _adminContract = IAdmin(_admin);
        _collateralContract = IERC20(_collateral);
    }

    /**
      * @dev Ensures that only the admin contract/admin can use functions
      */
    modifier onlyAdmin() { 
        require(
            // _adminContract.isWhitelistAdmin(msg.sender) ||
            msg.sender == address(_adminContract),
            "This functionality is restricted to admin addresses"
        );
        _;
    }

	function addFunding() external onlyAdmin() {
		
	}

    /**
      * @dev This allows admin addresses/contract to update/set the address
      *      of the vault contract
      */
    function setRegistry(address _registry) external onlyAdmin() {
        _registryContract = IRegistry(_registry);
    }

    /** 
      * @dev Allows the admin contract/address to hault payouts & freeze funds
      */
    function kill(bool _switch) external onlyAdmin() {
        // TODO: disable payouts,
        //          Send funding to admin contract/address?
    }
}