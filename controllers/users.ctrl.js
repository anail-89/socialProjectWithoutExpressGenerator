const { Users: usersModel } = require('../models');
const bcrypt = require('../managers/bcrypt');
const { sequelize, Sequelize } = require('../config/db');
const Users = require('../models/users')(sequelize, Sequelize);
const Op = Sequelize.Op;
const AppError = require('../managers/app-error');

class UsersCtrl {
    async getById(userId) {
        const user = await usersModel.findByPk(userId);
        return user;
    }
    getAll(data) {
            if (data.name || data.username || data.limit) {

                let options = {};

                options.where = {};
                options.attributes = {};
                options.attributes = ['name', 'username'];
                options.include = [{
                    model: postsModel,
                    as: 'userPosts',
                    // limit: 10,
                    attributes: ['id', 'title', 'description'],
                    order: [
                        ['id', 'DESC']
                    ]
                }];
                if (data.limit) {
                    options.limit = {};
                    options.limit = Number(data.limit);
                }
                if (data.name) {
                    options.where.name = {
                        [Op.iLike]: `%${data.name}%`
                    }
                }
                if (data.username) {
                    options.where.username = {
                        [Op.iLike]: `%${data.username}%`
                    }
                }

                return usersModel.findAll(options);

            } else {
                return usersModel.findAll();

            }
        }
        // async add(data) {
        //     const users = await usersModel.findAll({
        //         where: {
        //             username: {
        //                 [Op.like]: `%${data.username}%`
        //             }
        //         }
        //     });

    //     if (users.length > 0) {
    //         throw new AppError('User exists', 403);
    //         // throw new Error('User exists');
    //         //res.json({ success: false, data: null, message: 'User exists' })

    //     } else {
    //         //console.log(req.file);
    //         let user = await Users.create({
    //             name: data.name,
    //             username: data.username,
    //             path: data.path ? data.path : undefined,
    //             password: await bcrypt.hash(data.password), 
    //             email: data.email,
    //             isActive: true

    //         });

    //         return user;
    //         // await delete user.password;


    //     }


    // }
    update() {

    }
    delete() {

    }
}
module.exports = new UsersCtrl();