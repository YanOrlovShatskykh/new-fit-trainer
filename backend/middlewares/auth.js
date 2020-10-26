const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  // const token = authHeader.authorization && authHeader.authorization.split(" ")[1];
  if(!token) {
    return res.status(403).json('Denied');
  }
  await jwt.verify(token, config.get('jwtSecretKey'), (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json('Denied');
    }
    req.user = { email: user.email };
  });
  next();
}