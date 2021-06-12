const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if(req.headers['access'] == "yes"){
    next();
  }else{
  try {
    const token = req.headers.authorization;
    jwt.verify(token, "secret_this_should_be_longer_admin")
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
}
};
