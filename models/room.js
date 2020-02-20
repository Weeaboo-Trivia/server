'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class Room extends Model {}
  Room.init({
    name: DataTypes.STRING
  }, {
    sequelize
  })
 
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};