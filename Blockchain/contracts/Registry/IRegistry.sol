pragma solidity 0.5.10;

interface IRegistry {

    /**
      * @notice Allows the adding of a user as any user role. If the
      *         `msg.sender` is the admin contract, any user role may be added.
      *         If the `msg.sender` is a CHW, only patients and practitioners
      *         may be added.
      */
    function addUser(address _user, uint8 _userRole) external;
    
    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUser(address _user) external;
    
    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(address _user, uint8 _newUserRole) external;

    /**
      * @notice Allows the vault contract to verify an account for a payout.
      */
    function verifyPayout(address _user) external view returns(bool);
    
    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external view returns(uint8);

    /**
      * @return bool : If the contract is currently active.
      */
    function isAlive() external view returns(bool);
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external;
}