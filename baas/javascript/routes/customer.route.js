const express = require('express');
const customerCtrl = require('../controllers/customer.controller');

const router = express.Router();

router.route('/create').get(customerCtrl.createCustomer);
router.route('/list').get(customerCtrl.queryAllCustomers);

module.exports = router;
