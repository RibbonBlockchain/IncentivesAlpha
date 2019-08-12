pragma solidity = 0.5.0;

/**
  * @dev An interface for the registry contract
  * @author @vonnie610 (GitHub)
  */
contract IRegistry {

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
    function registerUser(address _newAddress, Role _role) external; 

    /**
      * @dev This function allows the admin contact to batch add new 
      *      addresses to the registry.
      */
    function registerUser(address[10] _newAddress, Role _role) external; 

    /**
      * @dev Allows the admin to update the role of a user
      */
    function updateRole(address _user, Role _newRole) external;

    function removeUser(address _user) external;

    function removeUsers(address[10] _users) external;
}