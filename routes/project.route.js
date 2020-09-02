const router = require('express').Router();
const Project = require('../models/project.model');
const Phase = require('../models/phase.model')
const checkToken = require('../config/config')
const sendMail = require('./mail')
const URL = process.env.APP_URL


// Show one project

// Show all past user projects
router.get("/archive", checkToken, async (req, res) => {
  try {
    let projects = await Project.find({$and: [{members:{$in: [req.user.id]}}, {isComplete: true}]}).populate('createdBy');
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

router.get("/:id", async (req, res) => {
  try {
    let project = await Project.findById(req.params.id).populate('members').populate('createdBy').populate({ 
      path: 'phases',
      populate: {
        path: 'deliverables',
        model: 'Deliverable'
      } 
   });
      res.status(200).json({
        message: 'Project fetched',
        project,
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error: Project not found",
      statuscode: 'EB500'
    })
  }
})

// Edit project
router.put("/:id", checkToken, async (req, res) => {
  try {
  
    let members = [...req.body.members]
    let newList = members.concat(req.user.id)
    let project = await Project.findByIdAndUpdate(req.params.id, {title: req.body.title, description: req.body.description, members: newList, startDate: req.body.startDate, endDate: req.body.endDate, activePhase: req.body.activePhase, isComplete: req.body.isComplete});
  
    let emailPopulate = await Project.findById(req.params.id).populate('members')
  
    let mailList = emailPopulate.members.map(member => member.email)
   
    let subject = `${project.title} was updated`
    let text = `Visit your project page to view the latest changes.`

    let html = `<h1>One of your projects has been updated.</h1><p>Visit your <a href='${URL}/projects/${project._id}'>project page</a> to view the latest changes.</p>`

    if(project){
      sendMail(mailList, subject, text, html, function(err, data){
        if(err){
          console.log('mail error', err)
        } else {
          console.log('mail sent')
        }
      })
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
    let members = [...req.body.members]
    let newList = members.concat(req.user.id)
    console.log('new list', newList)
    let project = await Project.create({ title: req.body.title, description: req.body.description, members: newList, createdBy: req.body.createdBy, startDate: req.body.startDate, endDate: req.body.endDate, organization: req.body.organization});


    let emailPopulate = await Project.findById(project._id).populate('members')
  
    let mailList = emailPopulate.members.map(member => member.email)
   
    let subject = `You have been added to a new project: ${project.title}`
    let text = `Visit your project page to view the latest changes.`

    let html = `<h1>You've been added to a new project on Streamliner! </h1><p>Visit your <a href='${URL}/projects/${project._id}'>project page</a> for more details.</p>`

    sendMail(mailList, subject, text, html, function(err, data){
      if(err){
        console.log('mail error', err)
      } else {
        console.log('mail sent')
      }
    })

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

//Get project phases
router.get("/:id/phases", checkToken, async (req, res) => {
  try {
    let phases = await Phase.find({project: req.params.id})
    console.log('phases', phases)
    res.status(201).json({
      message: 'Phases fetched',
      count: phases.length,
      phases,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error: Phases could not be fetched',
      statuscode: 'EB500'
    })
  }
})

//Create new phase 
router.post("/:id/phases/new", checkToken, async (req, res) => {
  try {

    let phase = await Phase.create({name: req.body.name, project: req.params.id})
    let project = await Project.findByIdAndUpdate(req.params.id, {$push: {phases: phase._id}})
    // console.log('phase', phase)
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

// Show all current user projects
router.get("/", checkToken, async (req, res) => {
  try {
    let projects = await Project.find({$and: [ {members:{$in: [req.user.id]}}, {isComplete: false}]}).populate('createdBy');
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