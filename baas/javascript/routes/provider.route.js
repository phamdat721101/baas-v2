const express = require('express');
const providerCtrl = require('../controllers/provider.controller');

const providerRouter = express.Router();

providerRouter.route('/list').get(providerCtrl.queryAllProviders);
providerRouter.route('/:proId').get(providerCtrl.getProvider)
providerRouter.route('/create').post(providerCtrl.createProvider);
providerRouter.route('/addService').post(providerCtrl.addService);
providerRouter.route('/addAgreement').post(providerCtrl.addAgreement);
providerRouter.route('/addRulePenalty').post(providerCtrl.addRulePenalty);
providerRouter.route('/updateRuleBiding').post(providerCtrl.updateRuleBiding);

module.exports = providerRouter;
