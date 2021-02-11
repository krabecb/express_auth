'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1,99],
        msg: 'Name must be between 1 and 99 characters'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        //Checks to see if it's an email. If not, then msg activates
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8,99],
        msg: 'Password must be between 8 and 99 characters'
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  //WE MADE THESE FUNCTIONS BELOW
  //We want these to happen before user is returned

    //Before it gets created, run this function
  user.addHook('beforeCreate', (pendingUser) => { //pendingUser is an object that gets passed to the DB
    //Bcrypt is going to hash the password
    //Hash 12 times.
    let hash = bcrypt.hashSync(pendingUser.password, 12)
    pendingUser.password = hash
  })

  //Add functions onto existing models
  //Prototype: Access all methods on a user, but we're going to add one
  user.prototype.validPassword = function(typedPassword) {
    //compareSync() compares typed password to password currently in the database. Unhashes and checks if they're both the same
    let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password)
    return isCorrectPassword
  }

  //toJSON: Bypass having to see user in previous data values.
  user.prototype.toJSON = function() {
    //return user data as JSON
    let userData = this.get()
    //This will not delete from the database
    //We want userData but do not want to display/bring the password with it
    delete userData.password
    return userData
  }

  return user;
};