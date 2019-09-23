pragma solidity = 0.5.10;

import "./WhitelistAdminRole.sol";
import "./IAdmin.sol";
import "../Vault/IFundingVault.sol";
import "../Registry/IRegistry.sol";

/**
  * @dev The Admin contract which controls the contract ecosystem.
  * @author @vonnie610 (GitHub)
  */
contract Admin is WhitelistAdminRole, IAdmin {
    // Keeps track of system liveness
    bool private isAlive = true;
    // A contract instance of the vault
    IFundingVault private _fundingVaultContract;
    // A contract instance of the registry
    IRegistry private _registryContract;

    /**
      * @dev Sets up the addresses for the vault and registry.
      * @notice This allows the admin to act as admin over these contracts.
      */
    constructor(address _vault, address _registry) 
        public
        onlyWhitelistAdmin()
    {
        _fundingVaultContract = IFundingVault(_vault);
        // Sends the vault the address of the registry
        _fundingVaultContract.setRegistry(_registry);
        _registryContract = IRegistry(_registryContract);
        // Sends the registry the address of the vault
        _registryContract.setVault(_vault);
    }

    /**
      * @dev This function allows an admin to freeze the vault and the active
      *      access control contract, as well as disabling payouts on the 
      *      registry & vault.
      */
    function systemFreeze(bool _switch) public onlyWhitelistAdmin() {
        isAlive = _switch;
        _fundingVaultContract.kill(_switch);
        _registryContract.kill(_switch);
    }

    /**
      * @dev Allows an admin to update the contract used for access control
      *      and fund rate limiting.
      */
    function updateAccessContract(address _newAccessContract) 
        public 
        onlyWhitelistAdmin()
    {
        _registryContract.updateAccessControl(_newAccessContract);
    }
}