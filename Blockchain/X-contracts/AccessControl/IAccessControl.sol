pragma solidity = 0.5.0;

/**
  * @dev An interface for the access control contract
  * @author @vonnie610 (GitHub)
  */
contract IAccessControl {
    
    /**
      * @dev Allows the registry to hault all of the access controls
      *      functionality
      * @notice The bool _switch means that this hault is reversable.
      */
    function killSwitch(bool _switch) external;
}