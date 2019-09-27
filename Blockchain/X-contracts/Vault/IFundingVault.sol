pragma solidity = 0.5.0;

contract IFundingVault {

    /**
      * @dev Allows the admin contract to update/set the address of the vault
      * @notice This can only be called by the admin contract
      */
    function setRegistry(address _registry) external;
    
    /**
      * @dev This function allows the admin contract to disable payouts and 
      *         withdraws from the vault.
      * @notice This function can only be called by an admin on the admin 
      *         contact.
      */
    function kill(bool _switch) external;

    // TODO:
    // 1. Functionality to approve an address to spend vault funds (onlyAdmin)
    // 2. Payout functionality 
    // 3. 
}