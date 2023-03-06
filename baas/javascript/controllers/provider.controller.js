const providerService = require('../services/provider.service');

/**
 * Generate Address
 * @public
 */
exports.queryAllProviders = async (req, res, next) => {
  try {
    const providers = await providerService.queryAllProviders();
    // console.log("PQD providers: ", providers[0])
    res.json({
      code: 0,
      data: providers
    });
  } catch (error) {
    console.error("Error query all providers: ", error)
    next(error);
  }
};

exports.getProvider = async(req, res, next) =>{
  try {
    let data = {
      proId: req.params.proId
    }
    console.log("Data get: ", data)
    const provider = await providerService.getProvider(data)
    res.json({
      code: 0,
      data: provider
    })
  } catch (error) {
    console.error("Error get provider: ", error)
    next(error);
  }
}

exports.addService = async(req, res, next) =>{
  try {
    let request = {
      serviceId: req.body.serviceId,
      proId: req.body.proId
    }
    let resp = await providerService.addService(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error adding service for provider: ", err)
    next(err)
  }
}

exports.createApiList = async(req, res, next) => {
  try {
    let request = {
      key: req.body.key,
      ruleId: req.body.ruleId,
      apiList: req.body.apiList
    }
    let resp = await providerService.createApiList(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error creating api list: ", err)
    next(err)
  }
}

exports.createProvider = async(req, res, next) =>{
  try {
    let request = {
      proId: req.body.proId,
      username: req.body.username,
      password: req.body.password
    }
    let resp = await providerService.createProvider(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error creating provider: ", err)
    next(err)
  }
}

exports.initProvider = async(req, res, next) =>{
  try {
    let resp = await providerService.initProvider()
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error creating provider: ", err)
    next(err)
  }
}

exports.addAgreement = async(req, res, next) =>{
  try {
    let request = {
      serviceId: req.body.serviceId,
      proId: req.body.proId,
      agreementId: req.body.agreementId,
      agrContent: req.body.agrContent
    }
    let resp = await providerService.addAgreement(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error creating agreement: ", err)
    next(err)
  }
}

exports.addRulePenalty = async(req, res, next) =>{
  try {
    let request = {
      proId: req.body.proId,
      serviceId: req.body.serviceId,
      agreementId: req.body.agreementId,
      ruleId: req.body.ruleId,
      ruleContent: req.body.ruleContent
    }
    let resp = await providerService.addRulePenalty(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error adding rule penalty: ", err)
    next(err)
  }
}

exports.updateRuleBiding = async(req, res, next) =>{
  // console.log("PQD update rule: ", req)
  try {
    let request = {
      proId: req.body.proId,
      ruleId: req.body.ruleId,
      contractId: req.body.contractId,
      status: req.body.status
    }
    let resp = await providerService.updateRuleBiding(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error updating rule bidding: ", err)
    next(err)
  }
}

exports.updateVoting = async(req, res, next) =>{
  try {
    let request = {
      proId: req.body.proId,
      contractId: req.body.contractId,
      isSuccessData: req.body.isSuccessData,
      serviceId: req.body.serviceId,
      slaId: req.body.slaId,
      ruleId: req.body.ruleId
    }
    let resp = await providerService.updateVoting(request)
    res.json({
        code: 0,
        data: resp
    })
  } catch (err) {
    console.error("Error updating voting: ", err)
    next(err)
  }
}