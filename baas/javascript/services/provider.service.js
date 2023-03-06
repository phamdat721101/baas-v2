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

exports.getProvider = async (data)=> {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        await checkIdentity(wallet);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('baas');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryProvider', [data.proId]);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();
        return JSON.parse(result.toString())
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

exports.queryAllProviders = async ()=> {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        await checkIdentity(wallet);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('baas');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryAllProviders');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();
        return JSON.parse(result.toString())
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

exports.addService = async (data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction("addService", [data.serviceId], [data.proId])

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Failed to submit transaction :", err)
        process.exit(1)
    }
}

exports.createApiList = async(data) =>{
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
         await contract.submitTransaction("createApiList", [data.key], [data.ruleId], [data.apiList]);
         console.log("Transaction has been submitted");
 
         // Disconnect from the gateway.
         await gateway.disconnect();
    } catch (err) {
        console.error("Faile to submit transaction: ", err)
        process.exit(1)
    }
}

exports.createProvider = async (data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction("createProvider", [data.proId], [data.username], [data.password]);
        console.log("Transaction has been submitted");

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Faile to submit transaction: ", err)
        process.exit(1)
    }
}

exports.initProvider = async ()=> {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction("initLedger");
        console.log("Transaction has been submitted");

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

exports.addAgreement = async (data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction("addAgreement", [data.serviceId], [data.proId], [data.agreementId], [data.agrContent])

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Failed to submit transaction :", err)
        process.exit(1)
    }
}

exports.addRulePenalty = async (data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction(
            "addRulePenalty", 
            [data.proId], 
            [data.serviceId], 
            [data.agreementId], 
            [data.ruleId], 
            [data.ruleContent]
        )

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Failed to submit transaction :", err)
        process.exit(1)
    }
}

exports.updateRuleBiding = async (data) =>{
    // console.log("PQD start update rule biding: ", data)
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction(
            "updateRuleBiding", 
            [data.proId], 
            [data.ruleId], 
            [data.contractId],
            [data.status]
        )

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Failed to submit transaction :", err)
        process.exit(1)
    }
}

exports.updateVoting = async (data) =>{
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("baas");

        // Submit the specified transaction.
        await contract.submitTransaction(
            "updateVoting", 
            [data.proId], 
            [data.contractId], 
            [data.isSuccessData],
            [data.serviceId],
            [data.slaId],
            [data.ruleId]
        )

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (err) {
        console.error("Failed to submit transaction :", err)
        process.exit(1)
    }
}