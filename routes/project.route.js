const router = require('express').Router();
const Project = require('../models/project.model');
const Phase = require('../models/phase.model')
const checkToken = require('../config/config')
// require('dotenv').config()

// const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//       type: 'OAuth2',
//       user: process.env.GMAIL_ADDRESS,
//       accessToken: process.env.GMAIL_TOKEN
//   }
// });

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
router.put("/:id", async (req, res) => {
  try {
    let project = await Project.findByIdAndUpdate(req.params.id, {title: req.body.title, description: req.body.description, members: req.body.members, startDate: req.body.startDate, endDate: req.body.endDate, activePhase: req.body.activePhase, isComplete: req.body.isComplete});
    let emailPopulate = Project.find(req.params.id).populate('members')
    let mailList = emailPopulate.map(member => {
        return member.email
    })
    if(project){
      res.status(200).json({
        message: 'Project was successfully updated'
      })
      // let info = await transporter.sendMail({
      //   from: process.env.GMAIL_ADDRESS, // sender address
      //   to: mailList, // list of receivers
      //   subject: `${project.title} has been updated`, // Subject line
      //   text: `${project.title} has been updated`, // plain text body
      //   html: "<b>Hello world?</b>", // html body
      // });
      // console.log("Message sent: %s", info.messageId);
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
    let project = await Project.create({ title: req.body.title, description: req.body.description, members: req.body.members, createdBy: req.body.createdBy, startDate: req.body.startDate, endDate: req.body.endDate, organization: req.body.organization});
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