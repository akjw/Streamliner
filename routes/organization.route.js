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

router.post("/new", async (req, res) => {
  try {
    let organization = await Organization.create({name: req.body.name})
    res.status(200).json({
      message: 'Organization created',
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Organization could not be created",
      statuscode: 'EB500'
    })
  }
})

router.put("/:id", checkToken, async (req, res) => {
  try {
    let organization =  await Organization.findByIdAndUpdate(req.params.id, {name: req.body.name});
    res.status(200).json({
      message: 'Organization updated',
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Organization could not be updated",
      statuscode: 'EB500'
    })
  }
})

router.delete("/:id", checkToken, async (req, res) => {
  try {
    let organization =  await Organization.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'Organization deleted',
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Organization could not be deleted",
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