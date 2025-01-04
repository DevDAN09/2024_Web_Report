const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        timestamps: true,
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

    Post.associate = (db) => {
        Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'number' });
        Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'id' });
    };

    return Post;
}; 