pragma solidity 0.5.10;

import { IVault } from "../Vault/IVault.sol";
import { IAdmin } from "../AdminDAO/IAdmin.sol";
import { WhitelistAdminRole } from "../Support/WhitelistAdminRole.sol";
import { SafeMath } from "../Support/math/SafeMath.sol";
import { IRegistry } from "./IRegistry.sol";

contract Registry is IRegistry, WhitelistAdminRole {
    using SafeMath for uint256;

    // The contract instance of the vault contract
    IVault internal _vaultInstance;
    // The contract instance of the admin contract
    IAdmin internal _adminInstance;
    // The storage of uses and their roles
    mapping(address => UserInfo) internal _userDetails;
    // The active state of the registry
    bool internal _active = true;

    struct UserInfo {
        uint8 _userRole;
        // 0 = inactive
        // 1 = super admin
        // 2 = admin (CHW)
        // 3 = patient
        // 4 = practitoner
    }

    /**
      * @notice Sets up the registries variables.
      */
    constructor(address _vault, address _admin) public WhitelistAdminRole() {
        _vaultInstance = IVault(_vault);
        _adminInstance = IAdmin(_admin);
        _userDetails[msg.sender]._userRole = 1;
        _userDetails[address(_adminInstance)]._userRole == 1;
    }

    modifier onlyAdminContract() {
        require(
            msg.sender == address(_adminInstance),
            "Permission denied, only admin contract can use functionality"
        );
        _;
    }

    modifier onlyVaultContract() {
        require(
            msg.sender == address(_vaultInstance),
            "Permission denied, only admin contract can use functionality"
        );
        _;
    }

    modifier isActive() {
        require(_active, "Registry is not active");
        _;
    }

    /**
      * @notice Allows the adding of a user as any user role. If the
      *         `msg.sender` is the admin contract, any user role may be added.
      *         If the `msg.sender` is a CHW, only patients and practitioners
      *         may be added.
      */
    function addUser(address _user, uint8 _newUserRole) external isActive() {
        if(_userDetails[msg.sender]._userRole == 2) {
            // Ensuring the CHW only adds roles it has permission to add
            require(
                _newUserRole != 1 && _newUserRole != 2,
                "Permission denied, CHW cannot add admin or CHW"
            );
            // Adding the user
            _addUser(_user, _newUserRole);

        } else if(_userDetails[msg.sender]._userRole == 1) {
            // Adding the user
            _addUser(_user, _newUserRole);

        } else {
            require(
                false,
                "Permission denied, only admin contract & CHW can use function"
            );
        }
    }
    
    /**
      * @notice Allows an admin to remove a user.
      */
    function removeUser(
        address _user
    )
        external
        isActive()
    {
        require(
            _userDetails[msg.sender]._userRole == 1,
            "Incorrect permissions"
        );

        _userDetails[_user]._userRole = 0;
    }
    
    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(
        address _user,
        uint8 _newUserRole
    )
        external
        isActive()
    {
        require(
            _userDetails[msg.sender]._userRole == 1,
            "Incorrect permissions"
        );

        _userDetails[_user]._userRole = _newUserRole;
    }
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external onlyAdminContract() {
        _active = false;
    }

    /**
      * @notice Allows the vault contract to record a payout.
      */
    function verifyPayout(
        address _user
    )
        external
        view
        onlyVaultContract()
        isActive()
        returns(bool)
    {
        require(
            _userDetails[_user]._userRole != 0,
            "Revert, user role inactive"
        );
        return true;
    }

    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external view returns(uint8) {
        return _userDetails[_user]._userRole;
    }

    /**
      * @return bool : If the contract is currently active.
      */
    function isAlive() external view returns(bool) {
        return _active;
    }

    function _addUser(
        address _user,
        uint8 _newUserRole
    )
        internal
        isActive()
        returns(uint8)
    {
        _userDetails[_user]._userRole = _newUserRole;
        return uint8(_userDetails[_user]._userRole);
    }
}