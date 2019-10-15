pragma solidity 0.5.10;

interface IAdmin {

    /**
      * @notice Allows the admin contract to remove a user.
      */
    function removeUserFromRegistry(address _user) external;

    /**
      * @notice Allows the admin of the admin contract to kill the eco-system.
      *         This will send all remaining collateral in the vault to the
      *         admin as well as burning all the tokens. This function will kill
      *         the vault and the registry.
      */
    function kill() external;
}