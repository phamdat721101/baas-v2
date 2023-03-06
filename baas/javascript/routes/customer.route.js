const express = require('express');
const customerCtrl = require('../controllers/customer.controller');

const router = express.Router();

router.route('/create').post(customerCtrl.createCustomer);
router.route('/list').get(customerCtrl.queryAllCustomers);
router.route('/:cuId').get(customerCtrl.getCustomer);

module.exports = router;
