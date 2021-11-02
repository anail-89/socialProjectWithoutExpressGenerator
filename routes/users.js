const express = require('express');
const router = express.Router();
const multer = require('multer');
const mimeType = require('mime-types');
const fs = require('fs').promises;
const path = require('path');
const usersJsonPath = path.join(__homedir, './users.json');
const UsersCtrl = require('../controllers/users.ctrl');
const { body, query, param } = require('express-validator');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mimeType.extension(file.mimetype));
    }
});

let upload = multer({ storage: storage });
const { sequelize, Sequelize } = require('../config/db');
const Users = require('../models/users')(sequelize, Sequelize);
const { Users: usersModel, Posts: postsModel } = require('../models');

const ResponseManager = require('../managers/response-managers');
const AppError = require('../managers/app-error');


const Op = Sequelize.Op;
const validationResult = require('../middlewares/validation-result');
const responseManager = require('../middlewares/response-handler');
const validateToken = require('../middlewares/validate-token');
//const { Sequelize } = require('sequelize');


router.route('/:id').get(
    param('id').exists(),
    responseManager,
    validationResult,
    async(req, res) => {
        try {
            const responseHandler = ResponseManager.getResponseHandler(res);
            const user = UsersCtrl.getById(req.params.id);
            responseHandler.onSuccess(user, '');
        } catch (e) {
            responseHandler.onError(e, e.message);
        }

    });
router.route('/').get(async(req, res) => {

    try {
        const responseHandler = ResponseManager.getResponseHandler(res);
        const users = await UsersCtrl.getAll({
            'name': query.name ? query.name : null,
            'username': query.username ? query.username : null,
            'limit': query.limit ? query.limit : null,
        });
        responseHandler.onSuccess(users, '');

    } catch (e) {
        responseHandler.onError(e, e.message);
    }


}).post(

    upload.single('image'),
    body('name').exists().bail().isLength({ min: 6 }),
    body('password').exists().bail().isLength({ min: 6 }),
    validationResult,
    responseManager,

    async(req, res) => {

        try {

            let user = await UsersCtrl.add({
                name: req.body.name,
                username: req.body.username,
                file: req.file,
                email: req.body.email,
                password: req.body.password
            });

            delete user.dataValues.password;
            res.onSuccess(user, 'User successfully created');

        } catch (e) {
            //await fs.unlink(path.join(__homedir,req.file.path));
            res.onError(e);

        }

    });

router.route('/:username').get(async(req, res) => {
    console.log(req.params.username);
    if (req.params && req.params.username) {
        await Users.findOne({ where: { username: req.params.username } }).then(user => {
            if (user) {
                res.json({
                    success: true,
                    data: user
                });
            } else {
                throw new Error('User not found');
            }


        }).catch(err => res.json({ success: false, data: null, message: 'User not exists!' }));
    } else {
        res.json({ success: false, data: null, message: 'User not exists!' })
    }

}).put(upload.single('image'), async(req, res) => {
    try {
        if (req.body && req.body.username) {
            await Users.findOne({ where: { username: req.params.username } }).then(user => {
                user.path = req.file.path;
                user.name = req.body.name;
                // await fs.unlink(path.join(__homedir, user.path));
                Users.update(user, { where: { username: req.params.username } });
                res.json({
                    success: true,
                    message: 'User successfully updated!',
                    data: user
                });

            }).catch(err => res.json({ success: false, data: null, message: 'User not exists!' }));
        } else {
            throw new Error('User not found!');
        }

    } catch (e) {
        res.json({ success: false, data: null, message: e.message });
    }
}).delete(async(req, res) => {
    try {
        if (req.params && req.params.username) {
            Users.destroy({ where: { username: req.params.username } }).then(() => res.json({
                success: true,
                message: 'User successfully deleted!'
            })).catch(err =>
                res.json({ success: false, data: null, message: 'User not exists!' }));

        } else {
            throw new Error('User not found!');
        }

    } catch (e) {
        res.json({ success: false, data: null, message: e.message });
    }
});
router.route('/current').post(
    validateToken,
    validationResult,
    responseManager,
    async(req, res) => {
        try {
            const data = await UsersCtrl.getById(req.decoded.userId);
            delete data.password;
            res.onSuccess(data, '');
        } catch (err) {
            res.onError(e);
        }

    }


);
module.exports = router;