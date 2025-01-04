const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    number: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false // createdAt, updatedAt 필드를 사용하지 않을 경우 false
  });

  return User;
};
