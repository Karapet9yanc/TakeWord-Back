const jwt = require('jsonwebtoken');

module.exports.verifyAccessToken = async (req, res, next) => {
    const token = req.headers.authorization;
    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
        return res.status(401).send('Token is not sended or is incorrect');
    }

    const currentUser = await User.findOne({ _id: payload.id });

    if (!currentUser) {
        return res.status(401).send('Unautorized');
    }

    req.payload = payload;
    next();
}