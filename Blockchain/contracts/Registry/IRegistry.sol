pragma solidity 0.5.10;

interface IRegistry {

    enum UserRole { INACTIVE, ADMIN, CHW, PAT, PRAC }

    /**
      * @notice Allows the adding of a user as any user role. If the
      *         `msg.sender` is the admin contract, any user role may be added.
      *         If the `msg.sender` is a CHW, only patients and practitioners
      *         may be added.
      */
    function addUser(address _user, UserRole _userRole) external;
    
    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUser(address _user) external;
    
    /**
      * @notice Allows the admin contract to update the role of the user.
      */
    function updateUser(address _user, UserRole _newUserRole) external;

    /**
      * @notice Allows the vault contract to record a payout.
      */
    function recordPayout(address _user, uint256 _amount) external;
    
    /**
      * @notice Returns the role of the user.
      */
    function getUserRole(address _user) external returns(UserRole);

    /**
      * @notice Returns the balance of the user.
      */
    function balanceOf(address _user) external returns(uint256);
    
    /**
      * @notice Allows the admin contract to kill the registry, which will
      *         prevent any users from being added or removed.
      */
    function kill() external;
}