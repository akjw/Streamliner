const router = require('express').Router();
const User = require('../models/user.model');
const checkToken = require('../config/config')
const bcrypt = require('bcrypt');

router.get("/all/:id", checkToken, async (req, res) => {
  try {
    let users =  await User.find({$and: [
      { _id: {$ne: req.user.id} },
      {organization: req.params.id}
  ]});
    res.status(200).json({
      message: 'Users fetched',
      count: users.length,
      users,
    })

  } catch (err) {
    res.status(500).json({
      message: "Error: Could not get organization users",
      statuscode: 'EB500'
    })
  }
})

router.put('/edit', checkToken, async (req, res) => {
  try {
    let {firstname, lastname, email, password } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    let user = await User.findByIdAndUpdate(req.user.id, {firstname: firstname, lastname: lastname, email: email, password: hashPassword} )
    if(user){
      res.status(200).json({
        message: 'User profile was successfully updated'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Cannnot Get User Info',
    })
  }
})

module.exports = router;