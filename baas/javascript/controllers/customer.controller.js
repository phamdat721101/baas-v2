const customerService = require('../services/customer.service');

/**
 * Generate Address
 * @public
 */
exports.createCustomer = async (req, res, next) => {
  try {
    let request = {
      cuId: req.body.cuId,
      username: req.body.username,
      password: req.body.password
    }
    let resp = await customerService.createCustomer(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error creating provider: ", err)
    next(err)
  }
};

exports.queryAllCustomers = async(req, res, next) =>{
  try {
    let resp = await customerService.queryAllCustomers()
    res.json({
      code: 0,
      data: resp
    })
  } catch (err) {
    console.error("Error get all customers: ", err)
    next(err)
  }
}

exports.getCustomer = async(req, res, next) =>{
  try {
    let data = {
      cuId: req.params.cuId
    };
    let customer = await customerService.getCustomer(data)
    console.log("Spec customer: ", customer)
    res.json({
      code: 0,
      data: customer
    })
  } catch (error) {
    console.error("Error get customer: ", error)
    next(error)
  }
}