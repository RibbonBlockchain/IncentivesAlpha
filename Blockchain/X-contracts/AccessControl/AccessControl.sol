pragma solidity = 0.5.0;

import "./IAccessControl.sol";
import "../Registry/IRegistry.sol";

/**
  * @dev An interface for the access control contract
  * @author @vonnie610 (GitHub)
  */
contract AccessControl is IAccessControl {

    bool private isAlive = true;
    IRegistry private _registryContract;

    constructor(address _registry) public {
        _registryContract = IRegistry(_registry);
    }
    
    /**
      * @dev Only allows the register to call this function. 
      */
    modifier onlyRegistry() {
        require(
            msg.sender == address(_registryContract), 
            "Functionality restricted to registry"
        );
        _;
    }

    /**
      * @dev Ensures that this contracts functionality is only accessible when
      *      the contract is alive.
      */
    modifier onlyAlive() {
        require(isAlive, "This contract has been killed");
        _;
    }

    /**
      * @dev Allows the registry to hault all of the access controls
      *         functionality
      * @notice The bool _switch means that this hault is reversable. This 
      *         function must be called in the admin contract, which will call
      *         the registry which will call this function. This was done for 
      *         upgradability.
      */
    function killSwitch(bool _switch) external onlyRegistry() {
        isAlive = _switch;
    }
}