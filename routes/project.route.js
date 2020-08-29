const router = require('express').Router();
const Project = require('../models/project.model');
const checkToken = require('../config/config')

// Show one project
router.get("/:id", async (req, res) => {
  try {
    let project =  await Project.findById(req.params.id);
    res.status(200).json({
      message: 'Project fetched',
      project,
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Project not found",
      statuscode: 'EB500'
    })
  }
})

// Edit project
router.put("/:id", async (req, res) => {
  try {
    let project = await Project.findByIdAndUpdate(req.params.id, req.body);
    if(project){
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


// Delete project
router.delete("/:id", async (req, res) => {
  try {
    let projectDelete = await Project.findByIdAndDelete(req.params.id);
    if (projectDelete){
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

// Create project
router.post("/new", checkToken, async (req, res) => {
  try {
    // let project = new Project(req.body);
    // await project.save();
    await Project.create({ title: req.body.title, description: req.body.description, members: req.body.members, postedBy: req.user.id, startDate: req.body.startDate, endDate: req.body.endDate});
    res.status(201).json({
      message: 'New project created',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error: Project could not be created',
      statuscode: 'EB500'
    })
  }
})

// Show all user projects
router.get("/", checkToken, async (req, res) => {
  try {
    let projects = await Project.find({members:{$in: [req.user.id]}});
    res.status(200).json({
      count: projects.length,
      projects,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error: Could not fetch user projects',
      statuscode: 'EB500'
    })
  }
})

module.exports = router;