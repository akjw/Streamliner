const jwt = require('jsonwebtoken');
// require('dotenv').config()

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if(!token){
    //401 -- unauthorized
    return res.status(401).json({
      message: 'You are not authorized for this action',
    });
  }
  try {
    //pass in token and jwt secret from auth.route 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //.user is from the payload object's key
    //everything is saved in req.user
    req.user = decoded.user;
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}