const jwt = require('jsonwebtoken');

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
    const decoded = jwt.verify(token, 'kaja');
    //.user is from the payload object's key
    //i'm saving everything in req.user
    req.user = decoded.user;
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}