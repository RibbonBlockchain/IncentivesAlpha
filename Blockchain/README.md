# Blockchain 

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
