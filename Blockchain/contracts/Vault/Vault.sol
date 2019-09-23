pragma solidity 0.5.10;

import { IVault } from "./IVault.sol"; 
import { WhiteListAdminRole } from "../Support/WhiteListAdminRole.sol";
import { ERC20 } from "../Support/token/ERC20.sol";
import { SafeMath } from "../Support/math/SafeMath.sol";

contract Vault is IVault, ERC20, WhiteListAdminRole {
    using SafeMath for uint256;

    // The ERC20 colalteral token
    IERC20 internal _collateralToken;
    // The active state of the contract
    bool internal _active;
    // The admin of the admin contract
    address internal _admin;

    /**
      * @dev Ensures that only the admin contract/admin can use functions
      */
    modifier isActive() {
        require(
            _active,
            "The vault is not active"
        );
        _;
    }

    constructor(
        address _admin,
        address _collateral
    )
        public
        WhiteListAdminRole()
    {
        _collateralToken = IERC20(_collateral);
        _admin = _admin;
    }

    /**
      * @dev This allows admin addresses/contract to update/set the address
      *      of the vault contract
      */
    function init(address _registry) external onlyWhitelistAdmin() {
        _registryContract = IRegistry(_registry);
    }

    /**
      * @notice Allows the vault to receive funds from the admin contract. This
      *         will mint tokens that will be owned by the vault until they are
      *         spent as payouts.
      */
    function donateFunds() external payable onlyWhitelistAdmin() isActive() {
        _collateralSupply.add(msg.value);
        _mint(address(this), msg.value.mul(10));
    }

    function payout(
        address _patient,
        address _practitioner,
        address _CHW,
        uint256 _amountEach
    )
        external
        isActive()
    {
        // check with registry that msg.sender is chw
        require(
            _amountEach.mul(3) >= _totalSupply,
            "Insuficient balance to compleate payout"
        );

        _mint(_patient, _amountEach);
        _mint(_practitioner, _amountEach);
        _mint(_CHW, _amountEach);
    }

    /**
      * @notice Allows the admin contract to kill the vault. This will make the
      *         vault send all collateral to the admin contract owner, as well
      *         as burn all remaining tokens.
      */
    function kill() external onlyWhitelistAdmin() isActive() {
        _active = false;

        _burn(address(this), _totalSupply);
        uint256 balance = _collateralToken.balanceOf(address(this));
        _collateralToken.transfer(_admin, balance);
    }
}