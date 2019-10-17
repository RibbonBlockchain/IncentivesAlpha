pragma solidity 0.5.10;

import { IVault } from "./IVault.sol";
import { IRegistry } from "../Registry/IRegistry.sol";
import { IAdmin } from "../AdminDAO/IAdmin.sol";
import { WhitelistAdminRole } from "../Support/WhitelistAdminRole.sol";
import { SafeMath } from "../Support/math/SafeMath.sol";

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
    event payoutRecord(address _pat, address prac, address _chw, uint256 _amount);

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
        uint256 _amountEach
    )
        external
        onlyAdminsAndCHW()
        isActive()
    {
        uint256 balance = address(this).balance;
        
        require(
            _amountEach.mul(3) >= balance,
            "Insuficient balance in vault to compleate payout"
        );
        require(
            _registryInstance.verifyPayout(_patient) &&
            _registryInstance.verifyPayout(_practitioner) &&
            _registryInstance.verifyPayout(_CHW)
            ,"Revert, a user in the payout was inactive"
        );

        _patient.transfer(_amountEach);
        _practitioner.transfer(_amountEach);
        _CHW.transfer(_amountEach);

        emit payoutRecord(_patient, _practitioner, _CHW, _amountEach);
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