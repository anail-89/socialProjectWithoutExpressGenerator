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
        // console.log(user !== null);
        // console.log(user.length > 0);
        // console.log(typeof(user.dataValues) !== undefined);
        // console.log(typeof(user.dataValues) !== 'undefined');
        // console.log(user.dataValues.length > 0);
        // console.log(user.dataValues);
        if (user !== null && typeof(user.dataValues) !== undefined) {
            console.log(user.dataValues.password);
            console.log(await bcrypt.compare(password, user.dataValues.password));
            if (bcrypt.compare(data.password, user.dataValues.password)) {
                return TokenManager.encode({
                    userId: user.dataValues.id
                });
            }
            throw new AppError('Username or password is wrong', 403);
        } else {
            return false;
        }
        return true;
        return user.dataValues && typeof(user.dataValues) !== undefined && user.dataValues.length > 0 ? user : false;



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
                path: data.file.path,
                password: await bcrypt.hash(data.password),
                email: data.email,
                isActive: true

            });

            return user;
        }
    }
}
module.exports = new Auth();