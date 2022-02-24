const userService = require('../../service/user-service');

module.exports.createNewUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    const userData = await userService.registration(login, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    });

    return res.json(userData);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}