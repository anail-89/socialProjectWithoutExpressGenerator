const db = require('../config/db');
//Models/tables
db.Users = require('./users.js')(db.sequelize, db.Sequelize);
db.Posts = require('./posts.js')(db.sequelize, db.Sequelize);

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