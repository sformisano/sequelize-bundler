const _getAssociatedModels = require('./_getAssociatedModels')
const _parseSequelizeFile = require('./_parseSequelizeFile')

module.exports = (sequelizeFiles, db) => {
  let models = {}

  sequelizeFiles.forEach(sequelizeFile => {
    Object.assign(models, _parseSequelizeFile(sequelizeFile, db))
  })

  return _getAssociatedModels(models)
}