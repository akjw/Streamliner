const router = require('express').Router();
const User = require('../models/user.model');
const checkToken = require('../config/config')

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

module.exports = router;