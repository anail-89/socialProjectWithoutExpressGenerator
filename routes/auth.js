const express = require('express');
const router = express.Router();
const multer = require('multer');
const mimeType = require('mime-types');
const fs = require('fs').promises;
const path = require('path');
const usersJsonPath = path.join(__homedir, './users.json');
const AuthCtrl = require('../controllers/auth.ctrl');
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
//const { Sequelize } = require('sequelize');

router.route('/login').post(
    body('username').exists().notEmpty(),
    body('password').exists().notEmpty(),
    validationResult,
    responseManager,
    async(req, res) => {
        try {
            console.log('ekaaaaav');
            const token = await AuthCtrl.login({
                ...req.body
            });
            console.log(token);
            // if (login === false) {
            //     throw new Error('Login failed, please enter the valid values!');
            // }
            res.onSuccess(token, 'You successfully logged');
        } catch (e) {
            res.onError(e);
        }

    }
);
module.exports = router;