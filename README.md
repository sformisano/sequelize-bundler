# Sequelize Bundler - Models Management Made Easy
[![Build Status](https://travis-ci.org/sformisano/sequelize-bundler.svg?branch=master)](https://travis-ci.org/sformisano/sequelize-bundler)
[![Coverage Status](https://coveralls.io/repos/github/sformisano/sequelize-bundler/badge.svg)](https://coveralls.io/github/sformisano/sequelize-bundler)
[![Maintainability](https://api.codeclimate.com/v1/badges/1bf350a80be568015f10/maintainability)](https://codeclimate.com/github/sformisano/sequelize-bundler/maintainability)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

This utility allows you to select Sequelize models through a glob, import them through the Sequelize import method, run associations after all of them are imported (so import order does not matter) and then retrieve all of them through a single variable.

Here's how you do it:

```js
const getBundledSequelizeModels = require('get-bundled-sequelize-models')

// remember, the param is a glob so you can match more complex directory/subdirectory structures
const appModels = getBundledSequelizeModels('path/to/my/models/**/*.js')
```

Here's an example user model:

```js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {}, {
    tableName: 'Users'
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
database table (single table inheritance style):

```js
module.exports = (sequelize, DataTypes) => {
  const ProviderUser = sequelize.define('ProviderUser', {}, {
    tableName: 'Users'
  })

  ProviderUser.associate = function (models) {
    models.ProviderUser.belongsTo(models.ProviderOrganization)
  }

  const CustomerUser = sequelize.define('CustomerUser', fields, {
    tableName: 'Users'
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
