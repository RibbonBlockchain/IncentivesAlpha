pragma solidity 0.5.10;

import { IVault } from "../Vault/IVault.sol";
import { IRegistry } from "../Registry/IRegistry.sol";
import { WhitelistAdminRole } from "../Support/WhitelistAdminRole.sol";
import { SafeMath } from "../Support/math/SafeMath.sol";
import { IAdmin } from "./IAdmin.sol";

contract Admin is IAdmin, WhitelistAdminRole {
    // The contract instance of the vault
    IVault internal _vaultInstance;
    // The contract instance of the registry
    IRegistry internal _registryInstance;

    constructor() public WhitelistAdminRole() {

    }

    function init(
        address _vault,
        address _registry
    )
        external
        onlyWhitelistAdmin()
    {
        _vaultInstance = IVault(_vault);
        _registryInstance = IRegistry(_registry);
    }

     /**
      * @notice Sends funds to the vault.
      */
    function donateFunds() external payable onlyWhitelistAdmin() {
        _vaultInstance.donateFunds();
    }

    /**
      * @notice Allows the admin contract to add a user as any user role.
      */
    function addUserInRegistry(
        address _user,
        uint8 _userRole
    )
        external
        onlyWhitelistAdmin()
    {
        _registryInstance.addUser(_user, _userRole);
    }

    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUserFromRegistry(address _user) external onlyWhitelistAdmin() {
        _registryInstance.removeUser(_user);
    }

    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUserInRegistry(
        address _user,
        uint8 _newUserRole
    )
        external
        onlyWhitelistAdmin()
    {
        _registryInstance.updateUser(_user, _newUserRole);
    }

    /**
      * @notice Allows the admin of the admin contract to kill the eco-system.
      *         This will send all remaining collateral in the vault to the
      *         admin as well as burning all the tokens. This function will kill
      *         the vault and the registry.
      */
    function kill() external onlyWhitelistAdmin() {
        _registryInstance.kill();
    }
}
