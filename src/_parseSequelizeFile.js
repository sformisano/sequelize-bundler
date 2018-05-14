module.exports = (sequelizeFile, db) => {
  let models = {}
  let fileModels = null

  try {
    fileModels = db.import(sequelizeFile)
  } catch(err) {
    console.log('The following sequelize file is not valid:', sequelizeFile)
    return false
  }

  // Some model files contain multiple models mapped to the same table, e.g.
  // single table inheritance models, so we make sure all files behave as an
  // array and loop through, i.e. if fileModels has a single model we turn it
  // into an array with just that single model.
  if (fileModels && !Array.isArray(fileModels)) {
    fileModels = [fileModels]
  }

  fileModels.forEach(model => models[model.name] = model)

  return models
}