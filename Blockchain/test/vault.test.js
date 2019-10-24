const etherlime = require("etherlime-lib");
const ethers = require("ethers");

let AdminAbi = require("../build/Admin.json");
let RegistryAbi = require("../build/Registry.json");
let VaultAbi = require("../build/Vault.json");

describe("Vault tests", async () => {
    let admin = accounts[1];
    let chw = accounts[2];
    let prac = accounts[3];
    let pat = accounts[4];
    let admin2 = accounts[5];
    let adminInstance, vaultInstance, registryInstance;
  
    beforeEach("", async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(admin.secretKey);
        
        // Deploying the contracts
        adminInstance = await deployer.deploy(
            AdminAbi, 
            false
        );
        
        vaultInstance = await deployer.deploy(
            VaultAbi,
            false,
            adminInstance.contract.address
        );
        
        registryInstance = await deployer.deploy(
            RegistryAbi,
            false,
            vaultInstance.contract.address,
            adminInstance.contract.address
        );
        
        // Init-ing the admin and vault contract (sending through missing addresses)
        await( await adminInstance.from(admin).init(
            vaultInstance.contract.address,
            registryInstance.contract.address
        )).wait();

        await( await vaultInstance.from(admin).init(
            registryInstance.contract.address
        )).wait();

        await registryInstance.from(admin).addUser(chw.signer.address, 2);
        await registryInstance.from(admin).addUser(pat.signer.address, 3);
        await registryInstance.from(admin).addUser(prac.signer.address, 4);
    });

    describe("State changing functions", async () => {
        describe("Donating funds", async () => {
            it("Adding funds through donation", async () => {
                let amount = ethers.utils.parseEther("100");
                await vaultInstance.from(admin).donateFunds("for the betterment of SA healthcare", {value: amount});
                let balance = await vaultInstance.balance();

                assert.equal(balance.toString(), amount.toString(), "Balance of vault incorrect, sending funds failed");
            });

            it("Adding funds through fallback function", async () => {
                let amount = ethers.utils.parseEther("100");
                let donater = accounts[6].signer;
                await donater.sendTransaction({
                    to: vaultInstance.contract.address,
                    value: amount
                });
                let balance = await vaultInstance.balance();

                assert.equal(balance.toString(), amount.toString(), "Balance of vault incorrect, sending funds failed");
            });
        });

        describe("Making a payout", async () => {
            it("Making a payout as an admin", async () => {
                let amount = ethers.utils.parseEther("300");
                await vaultInstance.from(admin).donateFunds("for the betterment of SA healthcare", {value: amount});
                let balance = await vaultInstance.balance();

                assert.equal(balance.toString(), amount.toString(), "Balance of vault incorrect, sending funds failed");

                let amountEach = ethers.utils.parseEther("100");
                await vaultInstance.from(admin).payout(
                    pat.signer.address,
                    prac.signer.address,
                    chw.signer.address,
                    amountEach,
                    amountEach,
                    amountEach
                );
                balance = await vaultInstance.balance();
                
                assert.equal(balance.toString(), 0, "Vault did not correctly send funds");
                // TODO add tests to check balances of each account, cant seem to get it to work
            });

            it("Making a payout as a CHW", async () => {
                let amount = ethers.utils.parseEther("300");
                await vaultInstance.from(admin).donateFunds("for the betterment of SA healthcare", {value: amount});
                let balance = await vaultInstance.balance();

                assert.equal(balance.toString(), amount.toString(), "Balance of vault incorrect, sending funds failed");

                let amountEach = ethers.utils.parseEther("100");
                await vaultInstance.from(chw).payout(
                    pat.signer.address,
                    prac.signer.address,
                    chw.signer.address,
                    amountEach,
                    amountEach,
                    amountEach
                );
                balance = await vaultInstance.balance();
                
                assert.equal(balance.toString(), 0, "Vault did not correctly send funds");
                // TODO add tests to check balances of each account, cant seem to get it to work
            });
        });

        describe("Killing contract", async () => {
            it("Killing contract as Admin contract", async () => {
                await adminInstance.from(admin).kill();
                let activeState = await vaultInstance.isAlive();
                
                assert.equal(activeState, false, "Contract has not been killed successfully")
            });
        });
    });

    describe("Input validation negative test", async () => {
        describe("Killing contract", async () => {
            it("Killing contract as non Admin contract fails", async () => {
                try {
                    await adminInstance.from(chw).kill();
                    assert.equal(true, false, "User was able to kill contract");
                } catch (error) {
                    assert.equal(true, true, "User was unable to kill contract");
                }
                
                let activeState = await registryInstance.isAlive();

                assert.equal(activeState, true, "Contract has not been killed successfully");
            });
        });

        describe("Making a payout", async () => {
            it("Making a payout as a non admin", async () => {
                let amount = ethers.utils.parseEther("300");
                await vaultInstance.from(admin).donateFunds("for the betterment of SA healthcare", {value: amount});
                let balance = await vaultInstance.balance();

                assert.equal(balance.toString(), amount.toString(), "Balance of vault incorrect, sending funds failed");

                let amountEach = ethers.utils.parseEther("100");

                try {
                    await vaultInstance.from(prac).payout(
                        pat.signer.address,
                        prac.signer.address,
                        chw.signer.address,
                        amountEach,
                        amountEach,
                        amountEach
                    );
                    assert.equal(true, false, "User was able to create payout with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was not able to send payout without correct permissions")
                }
                
                balance = await vaultInstance.balance();
                
                assert.equal(balance.toString(), amount.toString(), "Vault did not correctly send funds");
                // TODO add tests to check balances of each account, cant seem to get it to work
            });
        });
    });

    describe("View functions", async () => {
        it("Getting user roles", async () => {
            let userRoll = await registryInstance.getUserRole(admin.signer.address);
            let pracRoll = await registryInstance.getUserRole(prac.signer.address);
            let unregisteredRoll = await registryInstance.getUserRole(admin2.signer.address);
            
            assert.equal(userRoll, 1, "Admin does not have admin role");
            assert.equal(pracRoll, 4, "Practitioner does not have practitioner role");
            assert.equal(unregisteredRoll, 0, "unregistered user is not inactive");
        });

        it("Verifying payout", async () => {
            try {
                let userRoll = await registryInstance.from(admin).verifyPayout(admin.signer.address);
                assert.equal(true, false, "Incorect address can call protected function")
            } catch (error) {
                assert.equal(true, true, "Incorrect address blocked");
            }
        });

        it("Getting active state", async () => {
            let activeState = await registryInstance.isAlive();

            assert.equal(activeState, true, "Contract has not been killed successfully");
        });
    });
});