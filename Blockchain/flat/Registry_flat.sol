pragma solidity 0.5.10;

interface IVault {

    enum UserRole { INACTIVE, ADMIN, CHW, PAT, PRAC }
    
    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      */
    function donateFunds() external payable;

    /**
      * @notice Allows a CHW to create payouts. The `msg.sender` is verified
      *         against the registry.
      */
    function payout(
        address payable _patient,
        address payable _practitioner,
        address payable _CHW,
        uint256 _amountEach
    )
        external;

    /**
      * @notice Allows the admin contract to add the address of the registry.
      * @dev    The vault will not function untill this function has been
      *         called. This function is called from the admin contract.
      */
    function init(address _registry) external;

    /**
      * @notice Allows the admin contract to kill the vault. This will make the
      *         vault send all collateral to the admin contract owner, as well
      *         as burn all remaining tokens.
      */
    function kill() external;
}

interface IAdmin {

    enum UserRole { INACTIVE, ADMIN, CHW, PAT, PRAC }

    /**
      * @notice Sends funds to the vault.
      */
    function donateFunds() external payable;

    /**
      * @notice Allows the admin contract to add a user as any user role.
      */
    function addUser(address _user, uint8 _userRole) external;

    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUser(address _user) external;

    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(address _user, uint8 _newUserRole) external;

    /**
      * @notice Allows the admin of the admin contract to kill the eco-system.
      *         This will send all remaining collateral in the vault to the
      *         admin as well as burning all the tokens. This function will kill
      *         the vault and the registry.
      */
    function kill() external;
}

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}


interface IRegistry {

    enum UserRole { INACTIVE, ADMIN, CHW, PAT, PRAC }

    /**
      * @notice Allows the adding of a user as any user role. If the
      *         `msg.sender` is the admin contract, any user role may be added.
      *         If the `msg.sender` is a CHW, only patients and practitioners
      *         may be added.
      */
    function addUser(address _user, uint8 _userRole) external;
    
    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUser(address _user) external;
    
    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(address _user, uint8 _newUserRole) external;

    /**
      * @notice Allows the vault contract to record a payout.
      */
    function recordPayout(address _user, uint256 _amount) external;
    
    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external returns(UserRole);

    /**
      * @notice Returns the balance of the user.
      */
    function balanceOf(address _user) external returns(uint256);
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external;
}

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}


/**
 * @title WhitelistAdminRole
 * @dev WhitelistAdmins are responsible for assigning and removing Whitelisted accounts.
 */
contract WhitelistAdminRole {
    using Roles for Roles.Role;

    event WhitelistAdminAdded(address indexed account);
    event WhitelistAdminRemoved(address indexed account);

    Roles.Role private _whitelistAdmins;

    constructor () internal {
        _addWhitelistAdmin(msg.sender);
    }

    modifier onlyWhitelistAdmin() {
        require(isWhitelistAdmin(msg.sender), "WhitelistAdminRole: caller does not have the WhitelistAdmin role");
        _;
    }

    function isWhitelistAdmin(address account) public view returns (bool) {
        return _whitelistAdmins.has(account);
    }

    function addWhitelistAdmin(address account) public onlyWhitelistAdmin {
        _addWhitelistAdmin(account);
    }

    function renounceWhitelistAdmin() public {
        _removeWhitelistAdmin(msg.sender);
    }

    function _addWhitelistAdmin(address account) internal {
        _whitelistAdmins.add(account);
        emit WhitelistAdminAdded(account);
    }

    function _removeWhitelistAdmin(address account) internal {
        _whitelistAdmins.remove(account);
        emit WhitelistAdminRemoved(account);
    }
}






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
        UserRole _userRole;
        uint256 _balance;
    }

    /**
      * @notice Sets up the registries variables.
      */
    constructor(address _vault, address _admin) public WhitelistAdminRole() {
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
    function addUser(address _user, uint8 _newUserRole) external isActive() {
        if(_userDetails[msg.sender]._userRole == UserRole.CHW) {
            // Ensuring the CHW only adds roles it has permission to add
            require(
                _newUserRole != uint8(UserRole.ADMIN) && _newUserRole != uint8(UserRole.CHW),
                "Permission denied, CHW cannot add admin or CHW"
            );
            // Adding the user
            _userDetails[_user]._userRole = UserRole(_newUserRole);
            _userDetails[_user]._balance = 0;

        } else if(msg.sender == address(_adminInstance)) {
            // Adding the user
            _userDetails[_user]._userRole = UserRole(_newUserRole);
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
        uint8 _newUserRole
    )
        external
        onlyAdminContract()
    {
        _userDetails[_user]._userRole = UserRole(_newUserRole);
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