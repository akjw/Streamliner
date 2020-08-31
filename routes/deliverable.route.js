const router = require('express').Router();
const Project = require('../models/project.model');
const checkToken = require('../config/config')
const Phase = require('../models/phase.model')
const Deliverable = require('../models/deliverable.model');

//get deliverable
router.get("/:id", async (req, res) => {
  try {
    let deliverable = await Deliverable.findById(req.params.id)
      res.status(200).json({
        message: 'Deliverable fetched',
        deliverable,
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error: Deliverable not found",
      statuscode: 'EB500'
    })
  }
})

// Edit deliverable
router.put("/:id", checkToken, async (req, res) => {
  try {
    console.log('user', req.user.id)
    let deliverable = await Deliverable.findByIdAndUpdate(req.params.id, {name: req.body.name, description: req.body.description, deadline: req.body.deadline, createdBy: req.user.id, isComplete: req.body.isComplete});
    console.log('edited values', deliverable)
    if(deliverable){
      res.status(200).json({
        message: 'Deliverable was successfully updated'
      })
    }
  }
  catch(err){
    res.status(500).json({
      message: 'Error: Deliverable could not be updated'
    })
  }
})


// Delete phase
router.delete("/:id", async (req, res) => {
  try {
    let deliverable = await Deliverable.findById(req.params.id)
    await Phase.findByIdAndUpdate(deliverable.phase, {$pull: {deliverables: req.params.id}})
    let deliverableDelete = await Deliverable.findByIdAndDelete(req.params.id);
    if (deliverableDelete){
      res.status(200).json({
        message: 'Deliverable deleted',
      })
    }

  } catch(error){
    res.status(500).json({
      message: 'Error: Deliverable could not be deleted',
      statuscode: 'EB500'
    })
  }
})

module.exports = router;