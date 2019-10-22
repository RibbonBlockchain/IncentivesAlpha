pragma solidity 0.5.10;

interface IVault {
    
    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      * @param  _message : A message assosicated with the donation.
      */
    function donateFunds(string calldata _message) external payable;

    /**
      * @notice Allows a CHW to create payouts. The `msg.sender` is verified
      *         against the registry.
      */
    function payout(
        address payable _patient,
        address payable _practitioner,
        address payable _CHW,
        uint256 _patientAmount,
        uint256 _practitionerAmount,
        uint256 _CHWAmount
    )
        external;

    /**
      * @notice Allows the admin contract to add the address of the registry.
      * @dev    The vault will not function untill this function has been
      *         called. This function is called from the admin contract.
      */
    function init(address _registry) external;

    /**
      * @notice Allows the admin contract to kill the vault. This will make the
      *         vault send all collateral to the admin contract owner, as well
      *         as burn all remaining tokens.
      */
    function kill() external;
}