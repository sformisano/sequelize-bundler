# Sequelize Bundler - Sequelize Models Management Made Easy
[![Build Status](https://travis-ci.org/sformisano/sequelize-bundler.svg?branch=master)](https://travis-ci.org/sformisano/sequelize-bundler)
[![Coverage Status](https://coveralls.io/repos/github/sformisano/sequelize-bundler/badge.svg)](https://coveralls.io/github/sformisano/sequelize-bundler)
[![Maintainability](https://api.codeclimate.com/v1/badges/1bf350a80be568015f10/maintainability)](https://codeclimate.com/github/sformisano/sequelize-bundler/maintainability)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

This utility allows you to pick Sequelize models through a glob, import them through the Sequelize import method, run associations after all of them are imported (so import order does not matter) and then retrieve all of them through a single variable.

Here's how you do it:

```js
const getBundledSequelizeModels = require('get-bundled-sequelize-models')

// remember, the param is a glob so you can match complex directory structures
const appModels = getBundledSequelizeModels('path/to/my/models/**/*.js')
```

Here's an example user model:

```js
export default function (sequelize, DataTypes) {
  const fields = {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }

  const User = sequelize.define('User', fields, {
    tableName: 'Users',
    defaultScope: defaultScope,
    hooks: {
      beforeValidate: (user) => {
        if (type) {
          setSingleTableInheritanceType(user, type)
        }

        return new Promise((resolve, reject) => {
          // TODO make sure this excludes pre-existing users
          if (user.id) {
            resolve(user)
          }

          bcrypt.genSalt(10, (error, salt) => {
            if (error) {
              reject(error)
            }

            bcrypt.hash(user.password, salt, null, (error, hash) => {
              if (error) {
                reject(error)
              }

              user.password = hash

              resolve(user)
            })
          })
        })
      }
    }
  })

  // this will run after all models are imported, and you can reference any of
  // them through the models argument passed to this method
  User.associate = function (models) {
    // add your associations here, a few basic examples...
    models.User.hasMany(models.Posts)
    models.User.hasMany(models.Comments)
    models.Comments.belongsTo(models.User)
  }

  return User
}
```

**Pro tip:** model files can export multiple models, each with its own associations.

Here's an example user model file exporting multiple user types bound do the same
database table (i.e. STI):

```js
export default function (sequelize, DataTypes) {
  const fields = {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }

  const ProviderUser = sequelize.define('ProviderUser', fields, {
    tableName: 'Users',
    defaultScope: defaultScope,
    hooks: {
      beforeValidate: (user) => {
        if (type) {
          setSingleTableInheritanceType(user, type)
        }

        return new Promise((resolve, reject) => {
          // TODO make sure this excludes pre-existing users
          if (user.id) {
            resolve(user)
          }

          bcrypt.genSalt(10, (error, salt) => {
            if (error) {
              reject(error)
            }

            bcrypt.hash(user.password, salt, null, (error, hash) => {
              if (error) {
                reject(error)
              }

              user.password = hash

              resolve(user)
            })
          })
        })
      }
    }
  })

  ProviderUser.associate = function (models) {
    models.ProviderUser.belongsTo(models.ProviderOrganization)
  }

  const CustomerUser = sequelize.define('CustomerUser', fields, {
    tableName: 'Users',
    defaultScope: defaultScope,
    hooks: {
      beforeValidate: (user) => {
        if (type) {
          setSingleTableInheritanceType(user, type)
        }

        return new Promise((resolve, reject) => {
          // TODO make sure this excludes pre-existing users
          if (user.id) {
            resolve(user)
          }

          bcrypt.genSalt(10, (error, salt) => {
            if (error) {
              reject(error)
            }

            bcrypt.hash(user.password, salt, null, (error, hash) => {
              if (error) {
                reject(error)
              }

              user.password = hash

              resolve(user)
            })
          })
        })
      }
    }
  })

  CustomerUser.associate = function (models) {
    models.CustomerUser.belongsTo(models.CustomerOrganization)
  }

  return [ProviderUser, CustomerUser]
}
```

So there you have it. `appModels` will now hold a reference to all the imported/initialized
Sequelize models, so you can pass it through in any context you need them.

And don't worry if you end up calling `getBundledSequelizeModels('path/to/my/models/**/*.js')`
multiple times in multiple places for some reason: if you call it with the same glob,
you'll get the cached models that were already initialised.
