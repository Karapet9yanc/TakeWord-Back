const UserSchema = require('.././db/models/user-schema');
const bcrypt = require('bcrypt');
const yup = require('yup')
// const tokenService = require('./token-service');
// const ApiError = require('../exceptions/api-error');
// const UserDto = require('../dtos/user-dto');
const uuid = require('uuid');
const jwt = require('jsonwebtoken')
const mailService = require('./mail-service');

class UserService {
    async registration(login, password) {
        const candidate = await UserSchema.find({email: login});

        if (candidate.length > 0) {
            return {message: `User with login ${login} already exists.`};
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        const passwordNeedNumbers = /(?=.*[0-9])/
        const passwordNeedLowerCase = /(?=.*[a-z])/
        const passwordNeedUpperCase = /(?=.*[A-Z])/
        
        if(!login.match(emailRegex)){
            return {
                message: 'Invalid Email.'
            }
        }
        if(!password.match(passwordNeedLowerCase)){
            return {
                message: 'Password must contain lowercase letters.'
            }
        }
       
        if(!password.match(passwordNeedUpperCase)){
            return {
                message: 'Password must contain uppercase letters.'
            }
        }

        if(password.length < 6){
            return {
                message: 'Password must contain 6 letters.'
            }
        }

        if(!password.match(passwordNeedNumbers)){
            return {
                message: 'Password must contain numbers.'
            }
        }

        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 3);

        const user = await UserSchema.create({email: login, password: hashPassword,isActivated: false, activationLink });
        // await mailService.sendActivationEmail(login, `http://localhost:8000/activate/${activationLink}`);
        // const userDto = new UserDto(user);
        // const tokens = tokenService.generateTokens({ ...userDto });
        // await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { user: user }
    }
    async login(login, password) {
        const candidate = await UserSchema.find({email: login});

        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        const passwordNeedNumbers = /(?=.*[0-9])/
        const passwordNeedLowerCase = /(?=.*[a-z])/
        const passwordNeedUpperCase = /(?=.*[A-Z])/
        
        if(!login.match(emailRegex)){
            return {
                message: 'Invalid Email.'
            }
        }
        if(!password.match(passwordNeedLowerCase)){
            return {
                message: 'Password must contain lowercase letters.'
            }
        }
       
        if(!password.match(passwordNeedUpperCase)){
            return {
                message: 'Password must contain uppercase letters.'
            }
        }

        if(password.length < 6){
            return {
                message: 'Password must contain 6 letters.'
            }
        }

        if(!password.match(passwordNeedNumbers)){
            return {
                message: 'Password must contain numbers.'
            }
        }

        if (candidate.length > 0) {
            const currentUser = candidate[0]

            const checkPassword = await bcrypt.compare(password, currentUser.password)

            const token = jwt.sign({
                email: currentUser.email,
                userId: currentUser._id
            }, 
            process.env.JWT_ACCESS_SECRET, 
            {
                expiresIn: 1000 * 60 * 60 * 24 * 7
            })
            return { token: token } 
        } else {
            return {message: `User with login ${login} not found.`};
        }
    }
    async auth(user){
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, 
        process.env.JWT_ACCESS_SECRET, 
        {
            expiresIn: '7d'
        })
        return { token: token } 
    }
}

module.exports = new UserService();