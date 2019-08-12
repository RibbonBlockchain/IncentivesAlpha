pragma solidity = 0.5.0;

import "./IRegistry.sol";

/**
  * @dev The registry contract. Conforms to it's interface
  * @author @vonnie610 (GitHub)
  */
contract Registry is IRegistry {
    
    enum Role {PRACTITIONER, PATIENT, CHW}
    // Possible other roles: NURSE, DOCTOR

    struct UserInfo {
        Role role;
        uint256 lastPayout;
    }

    mapping(address => UserInfo) private _users;

    function registerUser(address _newAddress, Role _role) external {
        // Checking the msg.sender has the permissions to add a user

        
        // Saving users role to user address
        _users[_newAddress].role = _role;

    }

    
}