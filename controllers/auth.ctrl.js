const { Users: usersModel } = require('../models');
const bcrypt = require('../managers/bcrypt');
const { sequelize, Sequelize } = require('../config/db');
const Users = require('../models/users')(sequelize, Sequelize);
const Op = Sequelize.Op;
const AppError = require('../managers/app-error');
const TokenManager = require('../managers/token-manager');
class Auth {
    async login(data) {
        console.log(data);
        const { username, password } = data;
        const user = await usersModel.findOne({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
                // password: bcrypt.compare(data.password

            }
        });

        if (user !== null && typeof(user.dataValues) !== undefined) {

            if (await bcrypt.compare(password, user.dataValues.password)) {
                return TokenManager.encode({
                    userId: user.dataValues.id
                });
            }
            throw new AppError('Username or password is wrong', 403);
        } else {
            throw new AppError('Login failed, please enter the valid values!', 403);
        }
        return true;

    }
    async register(data) {
        const users = await usersModel.findAll({
            where: {
                username: {
                    [Op.like]: `%${data.username}%`
                }
            }
        });

        if (users.length > 0) {
            console.log('ka');
            throw new AppError('User exists');
            //res.json({ success: false, data: null, message: 'User exists' })

        } else {
            console.log('chka');
            console.log(data);
            // console.log(req.file);
            let user = await Users.create({
                name: data.name,
                username: data.username,
                path: data.file ? data.file.path : undefined,
                password: await bcrypt.hash(data.password),
                email: data.email,
                isActive: true

            });

            return user;
        }
    }
}
module.exports = new Auth();