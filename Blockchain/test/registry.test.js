const etherlime = require("etherlime-lib");
const ethers = require("ethers");

let AdminAbi = require("../build/Admin.json");
let RegistryAbi = require("../build/Registry.json");
let VaultAbi = require("../build/Vault.json");

describe("Registry tests", async () => {
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
    });

    describe("State changing functions", async () => {
        describe("Adding a user", async () => {
            it("Adding a user as an admin", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");
            });

            it("Adding a user as a community health worker (CHW)", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                await registryInstance.from(chw).addUser(pat.signer.address, 3);
                userRoll = await registryInstance.getUserRole(pat.signer.address);
                assert.equal(userRoll, 3, "User role not updated correctly");

                await registryInstance.from(chw).addUser(prac.signer.address, 4);
                userRoll = await registryInstance.getUserRole(prac.signer.address);
                assert.equal(userRoll, 4, "User role not updated correctly");
            });
        });

        describe("Removing a user", async () => {
            it("Removing a user as an admin", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User role not updated correctly");

                await registryInstance.from(admin).removeUser(chw.signer.address);
                userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 0, "User was not removed");
            });
        });

        describe("Updating a user", async () => {
            it("Updating a user as an admin", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User role not set correctly");

                await registryInstance.from(admin).updateUser(chw.signer.address, 1);
                userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 1, "User role not updated correctly");
            });
        });

        describe("Killing contract", async () => {
            it("Killing contract as Admin contract", async () => {
                await adminInstance.from(admin).kill();
                let activeState = await registryInstance.isAlive();

                assert.equal(activeState, false, "Contract has not been killed successfully")
            });
        });
    });

    describe("Input validation negative test", async () => {
        describe("Adding a user", async () => {
            it("Adding a user as a non-admin fails", async () => {
                try {
                    await registryInstance.from(prac).addUser(prac.signer.address, 1);
                    assert.equal(true, false, "User was able to add a user with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was unable to add a user without correct permissions");
                }

                let userRoll = await registryInstance.getUserRole(prac.signer.address);

                assert.equal(userRoll, 0, "User was incorrectly added as admin");
            });

            it("Adding an incorrect user role as a CHW fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                try {
                    await registryInstance.from(chw).addUser(prac.signer.address, 1);
                    assert.equal(true, false, "User was able to add a user with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was unable to add a user without correct permissions");
                }

                let userRoll2 = await registryInstance.getUserRole(prac.signer.address);

                assert.equal(userRoll2, 0, "User was incorrectly added as admin");

                try {
                    await registryInstance.from(chw).addUser(prac.signer.address, 2);
                    assert.equal(true, false, "User was able to add a user with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was unable to add a user without correct permissions");
                }

                let userRoll3 = await registryInstance.getUserRole(prac.signer.address);

                assert.equal(userRoll3, 0, "User was incorrectly added as admin");
            });

            it("Adding a user after contract has been killed fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                await adminInstance.from(admin).kill();

                try {
                    await registryInstance.from(admin).addUser(pat.signer.address, 3);
                    assert.equal(true, false, "User was able to add a user with a killed contract");
                } catch (error) {
                    assert.equal(true, true, "User was unable to add a user with a killed contract");
                }

                userRoll = await registryInstance.getUserRole(pat.signer.address);

                assert.equal(userRoll, 0, "User was incorrectly added");
            });
        });

        describe("Removing a user", async () => {
            it("Removing a user as a non admin fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                try {
                    await registryInstance.from(chw).removeUser(chw.signer.address);
                    assert.equal(true, false, "User was able to add a user with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was unable to add a user without correct permissions");
                }

                userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User was incorrectly removed");
            });

            it("Removing a user after contract has been killed fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                await adminInstance.from(admin).kill();

                try {
                    await registryInstance.from(admin).removeUser(chw.signer.address);
                    assert.equal(true, false, "User was able to remove a user with a killed contract");
                } catch (error) {
                    assert.equal(true, true, "User was unable to remove a user with a killed contract");
                }

                userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User was incorrectly removed");
            });
        });

        describe("Updating a user", async () => {
            it("Updating a user as a non admin fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User role not set correctly");

                try {
                    await registryInstance.from(chw).updateUser(chw.signer.address, 1);
                    assert.equal(true, false, "User was able to update a user with incorrect permissions");
                } catch (error) {
                    assert.equal(true, true, "User was unable to update a user without correct permissions");
                }
                
                userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User role updated incorrectly");
            });

            it("Updating a user after contract has been killed fails", async () => {
                await registryInstance.from(admin).addUser(chw.signer.address, 2);
                let userRoll = await registryInstance.getUserRole(chw.signer.address);
                assert.equal(userRoll, 2, "User role not updated correctly");

                await adminInstance.from(admin).kill();

                try {
                    await registryInstance.from(chw).updateUser(chw.signer.address, 1);
                    assert.equal(true, false, "User was able to update a user with a killed contract");
                } catch (error) {
                    assert.equal(true, true, "User was unable to update a user with a killed contract");
                }

                userRoll = await registryInstance.getUserRole(chw.signer.address);

                assert.equal(userRoll, 2, "User was incorrectly updated");
            });
        });

        describe("Killing contract", async () => {
            it("Killing contract as non Admin contract fails", async () => {
                try {
                    await adminInstance.from(CHW).kill();
                    assert.equal(true, false, "User was able to kill contract");
                } catch (error) {
                    assert.equal(true, true, "User was unable to kill contract");
                }
                
                let activeState = await registryInstance.isAlive();

                assert.equal(activeState, true, "Contract has not been killed successfully");
            });
        });
    });

    describe("View functions", async () => {
        it("Getting user roles", async () => {
            let userRoll = await registryInstance.getUserRole(admin.signer.address);
            let userRoll2 = await registryInstance.getUserRole(prac.signer.address);
            
            assert.equal(userRoll, 1, "Admin does not have admin role");
            assert.equal(userRoll2, 0, "unregistered user is not inactive");
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