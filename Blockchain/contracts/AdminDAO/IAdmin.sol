pragma solidity 0.5.10;

interface IAdmin {

    enum UserRole { INACTIVE, ADMIN, CHW, PAT, PRAC }

    /**
      * @notice Sends funds to the vault.
      */
    function donateFunds() external payable;

    /**
      * @notice Allows the admin contract to add a user as any user role.
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
      * @notice Allows the admin of the admin contract to kill the eco-system.
      *         This will send all remaining collateral in the vault to the
      *         admin as well as burning all the tokens. This function will kill
      *         the vault and the registry.
      */
    function kill() external;
}