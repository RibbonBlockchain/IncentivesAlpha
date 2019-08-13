pragma solidity = 0.5.0;

import "./IRegistry.sol";
import "../Admin/IAdmin.sol";
import "../Vault/IFundingVault.sol";

/**
  * @dev The registry contract. Conforms to it's interface
  * @author @vonnie610 (GitHub)
  */
contract Registry is IRegistry {
    // The users role in transactions
    enum Role {PRACTITIONER, PATIENT, CHW}
    // The live instance of the admin contract
    IAdmin private _adminContract;
    // The live instance of the vault contract
    IFundingVault private _vaultContract;
    // Storage of roles and previous payout timestamps
    struct UserInfo {
        Role role;
        uint256 lastPayout;
    }
    // Users to their roles
    mapping(address => UserInfo) private _users;

    constructor(address _adminContract) public {
        _adminContract = IAdmin(_adminContract);
    }

    /**
      * @dev Ensures that only the admin contract/admin can use functions
      */
    modifier onlyAdmin() { 
        require(
            _adminContract.isWhitelistAdmin(msg.sender) ||
            msg.sender == address(_adminContract),
            "This functionality is restricted to admin addresses"
        );
    }

    function setVault(address _vault) external onlyAdmin() {
        _vaultContract = IFundingVault(_vault);
    }
   
    function registerUser(address _newAddress, Role _role) external {
        // Checking the msg.sender has the permissions to add a user

        
        // Saving users role to user address
        _users[_newAddress].role = _role;
    }
}