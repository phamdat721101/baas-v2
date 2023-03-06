/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

// load the network configuration
const ccpPath = path.resolve(__dirname, '..', '../..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');

async function checkIdentity(wallet){
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
}

exports.createCustomer = async(data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        await checkIdentity(wallet)

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('baas');
         // Submit the specified transaction.
        let resp = await contract.submitTransaction("createCustomer", [data.cuId], [data.username], [data.password]);
         console.log("Transaction has been submitted");
 
         // Disconnect from the gateway.
         await gateway.disconnect();
        return resp
    } catch (err) {
        console.error(`Failed to evaluate transaction: ${err}`);
        process.exit(1);
    }
}

exports.queryAllCustomers = async() =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        await checkIdentity(wallet)

        const gateway = new Gateway()
        await gateway.connect(ccp, {wallet, identity: 'appUser', discovery:{enabled: true, asLocalhost: true}});

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('baas');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllCustomers');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();
        return JSON.parse(result.toString())
    } catch (err) {
        console.error("Failed to query all customer: ", err)
        process.exit(1)
    }
}

exports.getCustomer = async(data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        await checkIdentity(wallet)

        const gateway = new Gateway()
        await gateway.connect(ccp, {wallet, identity: 'appUser', discovery:{enabled: true, asLocalhost: true}});

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('baas');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryCustomer', [data.cuId]);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();
        return JSON.parse(result.toString())
    } catch (err) {
        console.error("Failed to get customer: ", err)
        process.exit(1)
    }
}