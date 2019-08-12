# Blockchain 

## Getting started
To set up dependencies run:
```
npm install
```
To compile contracts and run tests run:
```
npm run-script build
```


## Trouble shooting
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