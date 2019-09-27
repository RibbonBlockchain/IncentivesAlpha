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

    /**
      * @dev This allows admin addresses/contract to update/set the address
      *      of the vault contract
      */
    function init(address _registry) external onlyWhitelistAdmin() {
        _registryInstance = IRegistry(_registry);
    }

    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      */
    function donateFunds() external payable onlyAdminContract() isActive() {
        
    }

    function payout(
        address payable _patient,
        address payable _practitioner,
        address payable _CHW,
        uint256 _amountEach
    )
        external
        isActive()
    {
        uint256 balance = address(this).balance;
        // check with registry that msg.sender is chw
        require(
            _amountEach.mul(3) >= balance,
            "Insuficient balance in vault to compleate payout"
        );
        require(
            uint8(_registryInstance.getUserRole(_patient)) != uint8(UserRole.INACTIVE) &&
            uint8(_registryInstance.getUserRole(_practitioner)) != uint8(UserRole.INACTIVE) &&
            uint8(_registryInstance.getUserRole(_CHW)) != uint8(UserRole.INACTIVE)
            ,"Revert, a user in the payout was inactive"
        );

        _patient.transfer(_amountEach);
        _practitioner.transfer(_amountEach);
        _CHW.transfer(_amountEach);

        _registryInstance.recordPayout(_patient, _amountEach);
        _registryInstance.recordPayout(_practitioner, _amountEach);
        _registryInstance.recordPayout(_CHW, _amountEach);
    }

    /**
      * @notice Allows the admin contract to kill the vault. This will make the
      *         vault send all collateral to the admin contract owner, as well
      *         as burn all remaining tokens.
      */
    function kill() external onlyWhitelistAdmin() isActive() {
        _active = false;

        uint256 balance = address(this).balance;
        _creator.transfer(balance);
    }
}