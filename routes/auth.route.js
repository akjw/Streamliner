const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkToken = require('../config/config');
require('dotenv').config()


/* 
  @route POST api/auth/register
  @desc register user
  @access public
*/
router.post('/register', async (req, res) => {
  let {firstname, lastname, email, password, organization } = req.body;
  try {
    let user = new User({firstname, lastname, email, organization});
    //bcrypt takes in password and salt
    let hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();

    const payload = {
      user: {
        id: user._id,
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000000}, (err, token) => {
      if (err) throw err; //if error go to catch
      res.status(200).json({ message: 'User registered successfully!', token, user: payload });
    })
 
  } catch (error) {
    //500 - internal server error
    console.log(error.errors)
    res.status(500).json({message: 'Could not register new user'});
  }
})
/* 
  @route POST api/auth/login
  @desc login user
  @access public
*/
router.post('/login', async (req, res) => {
  // console.log('sent info', req.body)
  let {email, password } = req.body;
  try {
    //search db for user w matching email
    let user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message: 'user not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({message: 'incorrect login details'});
    }

    const payload = {
      user: {
        id: user._id
      }
    };
    //token on login

    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000000}, (err, token) => {
      if (err) throw err; 
      res.status(200).json({ token });
    })

  } catch (error) {
    res.status(500).json({ message: 'token missing' });
  }
})

router.get('/user', checkToken, async (req, res) => {
  try {
    let user = await User.findById(req.user.id, "-password").populate('organization')
    res.status(200).json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Cannnot Get User Info',
    })
  }
})
module.exports = router;