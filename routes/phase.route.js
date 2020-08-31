const router = require('express').Router();
const Project = require('../models/project.model');
const checkToken = require('../config/config')
const Phase = require('../models/phase.model')
const Deliverable = require('../models/deliverable.model');


//get phase 
router.get("/:id", async (req, res) => {
  try {
    let phase = await Phase.findById(req.params.id)
      res.status(200).json({
        message: 'Phase fetched',
        phase,
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error: Phase not found",
      statuscode: 'EB500'
    })
  }
})

// Edit phase
router.put("/:id", async (req, res) => {
  try {
    let phase = await Phase.findByIdAndUpdate(req.params.id, {name: req.body.name, subheader: req.body.subheader});
    if(phase){
      res.status(200).json({
        message: 'Project was successfully updated'
      })
    }
  }
  catch(err){
    res.status(500).json({
      message: 'Error: Project could not be updated'
    })
  }
})


// Delete phase
router.delete("/:id", async (req, res) => {
  try {
    let phase = await Phase.findById(req.params.id)
    await Project.findByIdAndUpdate(phase.project, {$pull: {phases: req.params.id}})
    let phaseDelete = await Phase.findByIdAndDelete(req.params.id);
    if (phaseDelete){
      res.status(200).json({
        message: 'Project deleted',
      })
    }

  } catch(error){
    res.status(500).json({
      message: 'Error: Project could not be deleted',
      statuscode: 'EB500'
    })
  }
})


//Create new deliverable
router.post("/:id/deliverables/new", checkToken, async (req, res) => {
  try {
    let deadline;
    if(req.body.deadline){
      deadline = req.body.deadline 
    } else {
      deadline = new Date()
    }
    let phase = await Phase.findById(req.params.id)
    let project = await Project.findById(phase.project)
    let deliverable = await Deliverable.create({name: req.body.name, description: req.body.description, project: project._id, phase: req.params.id, deadline: deadline, createdBy: req.body.createdBy})
    let updatePhase = await Phase.findByIdAndUpdate(req.params.id, {$push: {deliverables: deliverable._id}})
    console.log('BIG D', deliverable)
    res.status(201).json({
      message: 'New phase created',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error: Phase could not be created',
      statuscode: 'EB500'
    })
  }
})

module.exports = router;