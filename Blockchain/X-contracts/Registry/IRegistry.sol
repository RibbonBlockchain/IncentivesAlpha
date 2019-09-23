pragma solidity = 0.5.0;

/**
  * @dev An interface for the registry contract
  * @author @vonnie610 (GitHub)
  */
contract IRegistry {

    /**
      * @dev Allows the admin contract to update/set the address of the vault
      * @notice This can only be called by the admin contract
      */
    function setVault(address _vault) external;

    /**
      * @dev Allows the admin contract to update the access control contract
      */
    function updateAccessControl(address _newAccessControl) external;

    /**
      * @dev Allows the admin contract to kill the access control contract
      * @notice The access control contract will not self destruct, but all 
      *         functionality will be haulted. 
      */
    function kill(bool _switch) external;

    /**
      * @dev This function allows the admin contact or a CHW to add new 
      *      addresses to the registry.
      */
    function registerUser(address _newAddress, uint8 _role) external; 

    /**
      * @dev Allows the admin to update the role of a user
      */
    function updateRole(address _user, uint8 _newRole) external;

    /**
      * @dev Allows the admin contract to remove a user
      */
    function removeUser(address _user) external;

}