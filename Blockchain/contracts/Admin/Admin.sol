pragma solidity = 0.5.0;

import "@openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import "./IAdmin.sol";
import "../Vault/IFundingVault.sol";
import "../Registry/IRegistry.sol";

contract Admin is WhitelistAdminRole, IAdmin {

    IFundingVault private _fundingVaultContract;
    IRegistry private _registryContract;
    
    constructor() public {

    }

    init(address _vault, address _registry) public onlyWhitelistAdmin() {
        _fundingVaultContract = IFundingVault(_vault);
        _registryContract = IRegistry(_registryContract);
    }
}