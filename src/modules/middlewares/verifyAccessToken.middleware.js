const jwt = require('jsonwebtoken');
const UserSchema = require('../../db/models/user-schema/index');

module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
    
        if(!token) {
            return res.status(401).send('Token is not sended or is incorrect');
        }
        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return res.status(403).json({message: 'Invalid Token'})
        }

        const currentUser = await UserSchema.findOne({ _id: decodedData.userId });

        if (!currentUser) {
            return res.status(401).send('Unautorized');
        }

        req.user = currentUser

        next();
    } catch (e) {
        return res.status(403).json({message: 'Unautorized'})
    }
}