pragma solidity 0.5.10;

interface IVault {
    
    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      * @param  _message : A message assosicated with the donation.
      */
    function donateFunds(string calldata _message) external payable;

    /**
      * @notice Allows a CHW to create payouts. The `msg.sender` is verified
      *         against the registry.
      */
    function payout(
        address payable _patient,
        address payable _practitioner,
        address payable _CHW,
        uint256 _patientAmount,
        uint256 _practitionerAmount,
        uint256 _CHWAmount
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

interface IRegistry {

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
      * @notice Allows the vault contract to verify an account for a payout.
      */
    function verifyPayout(address _user) external view returns(bool);
    
    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external view returns(uint8);

    /**
      * @return bool : If the contract is currently active.
      */
    function isAlive() external view returns(bool);
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external;
}

interface IAdmin {

    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUserFromRegistry(address _user) external;

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






contract Vault is IVault, WhitelistAdminRole {
    using SafeMath for uint256;
    
    // The active state of the contract
    bool internal _active;
    // The admin of the admin contract
    IAdmin internal _adminInstance;
    // The contract instance of the registry
    IRegistry internal _registryInstance;
    // Creator address
    address payable internal _creator;

    event recivedDonation(uint256 _amount, address _from, string _message);
    event payoutRecord(address _pat, address _prac, address _chw, uint256 _patAmount, uint256 _practAmount, uint256 _chwAmount);

    constructor(
        address _admin
    )
        public
        WhitelistAdminRole()
    {
        _adminInstance = IAdmin(_admin);
    }

    /**
      * @dev Ensures that only the admin contract/admin can use functions
      */
    modifier isActive() {
        require(
            _active,
            "The vault is not active"
        );
        _;
    }

    modifier onlyAdminContract() {
        require(
            msg.sender == address(_adminInstance),
            "Permission denied, only admin contract can use functionality"
        );
        _;
    }

    modifier onlyAdminsAndCHW() {
        require(
            _registryInstance.getUserRole(msg.sender) == 1 ||
            _registryInstance.getUserRole(msg.sender) == 2,
            "User does not have correct permissions to make payout"
        );
        _;
    }

    /**
      * @dev This allows admin addresses/contract to update/set the address
      *      of the vault contract
      */
    function init(address _registry) external onlyWhitelistAdmin() {
        _registryInstance = IRegistry(_registry);
        _active = true;
    }

    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      */
    function donateFunds(string calldata _message) external payable isActive() {
        emit recivedDonation(msg.value, msg.sender, _message);
    }

    function payout(
        address payable _patient,
        address payable _practitioner,
        address payable _CHW,
        uint256 _patientAmount,
        uint256 _practitionerAmount,
        uint256 _CHWAmount
    )
        external
        onlyAdminsAndCHW()
        isActive()
    {
        uint256 balance = address(this).balance;

        uint256 _totalTransfer = _patientAmount + _practitionerAmount + _CHWAmount;
        
        require(
            _totalTransfer <= balance,
            "Insuficient balance in vault to compleate payout"
        );
        require(
            _registryInstance.verifyPayout(_patient) &&
            _registryInstance.verifyPayout(_practitioner) &&
            _registryInstance.verifyPayout(_CHW)
            ,"Revert, a user in the payout was inactive"
        );

        _patient.transfer(_patientAmount);
        _practitioner.transfer(_practitionerAmount);
        _CHW.transfer(_CHWAmount);

        emit payoutRecord(_patient, _practitioner, _CHW, _patientAmount, _practitionerAmount, _CHWAmount);
    }

    /**
      * @notice Allows the admin contract to kill the vault. This will make the
      *         vault send all collateral to the admin contract owner, as well
      *         as burn all remaining tokens.
      */
    function kill() external onlyAdminContract() {
        _active = false;

        uint256 balance = address(this).balance;
        _creator.transfer(balance);
    }

    /**
      * @return bool : If the contract is currently active.
      */
    function isAlive() external view returns(bool) {
        return _active;
    }

    function balance() external view returns(uint256) {
        return address(this).balance;
    }

    function() external payable {
        emit recivedDonation(msg.value, msg.sender, "fallback function donation");
    }
}