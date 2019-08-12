pragma solidity = 0.5.0;

import "@openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "./IAdmin.sol";
import "../Vault/IFundingVault.sol";
import "../Registry/IRegistry.sol";

contract Admin is WhitelistAdminRole, IAdmin {

    bool private isAlive = true;
    IFundingVault private _fundingVaultContract;
    IRegistry private _registryContract;
    
    constructor() public {

    }

    /**
      * @dev Sets up the addresses for the vault and registry.
      * @notice This allows the admin to act as admin over these contracts.
      */
    init(address _vault, address _registry) public onlyWhitelistAdmin() {
        _fundingVaultContract = IFundingVault(_vault);
        _registryContract = IRegistry(_registryContract);
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
}