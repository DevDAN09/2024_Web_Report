const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        timestamps: true,
        underscored: false,
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

    Comment.associate = (db) => {
        Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'number' });
        Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });
    };

    return Comment;
}; 