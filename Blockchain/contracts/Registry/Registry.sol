pragma solidity 0.5.10;

import { IVault } from "../Vault/IVault.sol";
import { IAdmin } from "../AdminDAO/IAdmin.sol";
import { WhiteListAdminRole } from "../Support/WhitelistAdminRole.sol";
import { SafeMath } from "../Support/math/SafeMath.sol";
import { IRegistry } from "./IRegistry.sol";

contract Registry is IRegistry, WhiteListAdminRole {
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
        UserRole _userRole;
        uint256 _balance;
    }


    constructor(address _vault, address _admin) public WhiteListAdminRole() {
        _vaultInstance = IVault(_vault);
        _adminInstance = IAdmin(_admin);
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
    function addUser(address _user, UserRole _newUserRole) external isActive() {
        if(_userDetails[msg.sender]._userRole == UserRole.CHW) {
            // Ensuring the CHW only adds roles it has permission to add
            require(
                _newUserRole != UserRole.ADMIN && _newUserRole != UserRole.CHW,
                "Permission denied, CHW cannot add admin or CHW"
            );
            // Adding the user
            _userDetails[_user]._userRole = _newUserRole;
            _userDetails[_user]._balance = 0;

        } else if(msg.sender == address(_adminInstance)) {
            // Adding the user
            _userDetails[_user]._userRole = _newUserRole;
            _userDetails[_user]._balance = 0;

        } else {
            require(
                false,
                "Permission denied, only admin contract & CHW can use function"
            );
        }
    }
    
    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUser(address _user) external onlyAdminContract() isActive() {
        _userDetails[_user]._userRole = UserRole.INACTIVE;
    }
    
    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(
        address _user,
        UserRole _newUserRole
    )
        external
        onlyAdminContract()
    {
        _userDetails[_user]._userRole = _newUserRole;
    }

    /**
      * @notice Allows the vault contract to record a payout.
      */
    function recordPayout(
        address _user,
        uint256 _amount
    )
        external
        onlyVaultContract()
        isActive()
    {
        require(
            _userDetails[_user]._userRole != UserRole.INACTIVE,
            "Revert, user role inactive"
        );
        
        _userDetails[_user]._balance = _userDetails[_user]
            ._balance.add(_amount);
    }

    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external returns(UserRole) {
        return _userDetails[_user]._userRole;
    }

    /**
      * @notice Returns the balance of the user.
      */
    function balanceOf(address _user) external returns(uint256) {
        return _userDetails[_user]._balance;
    }
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external onlyAdminContract() {
        _active = false;
    }
}