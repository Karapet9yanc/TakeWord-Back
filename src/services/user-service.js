const UserSchema = require('.././db/models/user-schema');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');
const uuid = require('uuid');
const mailService = require('./mail-service');

class UserService {
    async registration(login, password) {
        const candidate = await UserModel.findOne({ login });

        if (candidate) {
            throw ApiError.BadRequest(`User with login ${login} already exists.`);
        }

        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 3);

        const user = await UserModel.create({ login, password: hashPassword, activationLink });
        await mailService.sendActivationEmail(email, `http://localhost:8000/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService();