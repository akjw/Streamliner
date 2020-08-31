const router = require('express').Router();
const Project = require('../models/project.model');
const checkToken = require('../config/config')
const Phase = require('../models/phase.model')


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

module.exports = router;