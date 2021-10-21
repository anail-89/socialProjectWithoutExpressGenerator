const { Sequelize } = require('sequelize');
//const config = require('../config/db')['development'];
// const sequelize = new Sequelize(config.database, config.username, config.password, {
//     host: config.host,
//     dialect: config.dialect
// });
const sequelize = new Sequelize('test8', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgresql'
});
const db = {};

db.Sequelize = Sequelize;


db.sequelize = sequelize;

console.log(sequelize);
//Models/tables
db.Users = require('./users.js')(sequelize, Sequelize);
db.Posts = require('./posts.js')(sequelize, Sequelize);
console.log(db.Users);
console.log(db.Users);
Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

//Relationships

db.Users.hasMany(db.Posts, {
    as: 'userPosts',
    foreignKey: 'author_id'
});

db.Posts.belongsTo(db.Users, {
    as: 'postsWithUsers',
    foreignKey: 'author_id'
})

module.exports = db;