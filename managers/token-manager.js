const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

class TokenManager {
    static encode(data) {
        return jwt.sign(data, config.privateKey, {
            expiresIn: 60 * 60 * 24
        });
    }

    static async decode(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.privateKey, function(err, decoded) {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        })
    }
}

module.exports = TokenManager;