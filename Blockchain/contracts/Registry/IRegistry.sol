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
    function killAccessControl(bool _switch) external;


}