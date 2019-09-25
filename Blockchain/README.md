# Blockchain 

## Index
[1. Getting started](#1-getting-started)
[2. Trouble shooting](#2-trouble-shooting)
[3. Security considerations](#3-security-considerations)
[Contract architecture](#contract-architecture)

## 1. Getting started
To set up dependencies run:
```
npm install
```
To compile contracts and run tests run:
```
npm run-script build
```


## 2. Trouble shooting
If when running the tests there is an issue (a function's parameters differ from params provided, function does not exits, etc), this may be a truffle error.
If a change has been made to the contracts, occasionally it will incorrectly compile the contracts byte code. If this happens please run the following:
```
npm run-script build-err
```
This script will require you to enter `y`, as you are deleting the build directory. This will not break anything. 
<!-- If you are linux please run:
```
npm run-script build-err-lnx
``` -->

## 3. Security considerations
Within contract, other contracts are not stored as addresses but rather instances of the contract. This method ensures that any address saved conforms/ is compliance to the interface or contract provided. 
i.e:
```
// Insecure
address private _contract;

// Secure 
InterfaceOfContract private _contractInstance;
```

# Contract architecture

// TODO insert diagram 

## Contract breakdown 
In order of deployment

### `AdminDAO.sol`

#### Functions

`donateFunds()`
Sends funds to the vault

`addUser(address _user, UserRole _userRole)`
Allows the admin contract to add a user as any user role.

`removeUser(address _user)` 
Allows the admin contract to remove a user.

`updateUser(address _user, UserRole _newUserRole)`
Allows the admin contract to update the role of the user.

`kill()`
Allows the admin of the admin contract to kill the eco-system. This will send all remaining collateral in the vault to the admin as well as burning all the tokens. This function will kill the vault and the registry. 

### `Vault.sol`

This contract is an ERC20 contract. Each token is worth 1/10 of the collateral token. 

#### Functions

`donateFunds()`
Allows the vault to receive funds from the admin contract. This will mint tokens that will be owned by the vault until they are spent as payouts.

`payout(address _patient, address _practitioner, address _CHW)`
Allows a CHW to create payouts. The `msg.sender` is verified against the registry.

`kill()`
Allows the admin contract to kill the vault. This will make the vault send all collateral to the admin contract owner, as well as burn all remaining tokens. 

### `Registry.sol`

#### Functions

`addUser(address _user, UserRole _userRole)`
Allows the adding of a user as any user role. If the `msg.sender` is the admin contract, any user role may be added. If the `msg.sender` is a CHW, only patients and practitioners may be added. 

`removeUser(address _user)` 
Allows the admin contract to remove a user.

`updateUser(address _user, UserRole _newUserRole)`
Allows the admin contract to update the role of the user.

`getUserRole(address _user)`
Returns the role of the user.

`kill()`
Allows the admin contract to kill the registry, which will prevent any users from being added or removed.
