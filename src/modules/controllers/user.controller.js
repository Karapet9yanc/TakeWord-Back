const userService = require('../../services/user-service');


module.exports.createNewUser = async (req, res) => {
  try {
    const { login, password } = req.query;

    const userData = await userService.registration(login, password);

    // res.cookie('refreshToken', userData.refreshToken, {
    //   maxAge: 1000 * 60 * 60 * 24 * 30,
    //   httpOnly: true
    // });

    if(userData.message){
      res.status(403).json(userData)
    } else {
      res.status(200).json(userData)
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}


module.exports.login = async (req, res) => {
  try{
    const { login, password } = req.query;

    const result = await userService.login(login, password)

    if(result.message){
      res.status(403).json(result)
    } else {
      res.json(result)
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}


module.exports.auth = async (req, res) => {
  try {
    const { user } = req
    const token = await userService.auth(user)
    
    if(token){
      res.status(200).json(token)
    } else {
      res.status(200).json({message: 'invalid token'})
    }
    
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}