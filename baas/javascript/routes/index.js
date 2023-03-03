const express = require('express');
const customer = require('./customer.route');
const provider = require('./provider.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/customer', customer);
router.use('/provider', provider);

module.exports = router;
