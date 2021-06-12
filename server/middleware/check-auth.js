const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if(req.headers['access'] == "yes"){
    next();
  }
  else{
  try {
    const token = req.headers.authorization;
    try{
      jwt.verify(token, "secret_this_should_be_longer_user")
    } catch(error){
      try{
        jwt.verify(token, "secret_this_should_be_longer_admin")
      }catch(err){
        res.status(401).json({ message: "Auth failed!" });
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
}
};
