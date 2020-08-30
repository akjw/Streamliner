const router = require('express').Router();
const Organization = require('../models/organization.model');
const checkToken = require('../config/config')

router.get("/:id", async (req, res) => {
  try {
    let organization =  await Organization.findById(req.params.id);
    res.status(200).json({
      message: 'Organization fetched',
      organization,
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Organization not found",
      statuscode: 'EB500'
    })
  }
})

router.get("/", async (req, res) => {
  try {
    let organizations =  await Organization.find();
    res.status(200).json({
      message: 'Organizations fetched',
      organizations,
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Organizations not found",
      statuscode: 'EB500'
    })
  }
})

module.exports = router;