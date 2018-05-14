const getFilesMatchingGlob = require('get-files-matching-glob')
const _parseSequelizeFiles = require('./_parseSequelizeFiles')

let modelsCache = {}

module.exports = (globPattern, db) => {
  if (modelsCache.hasOwnProperty(globPattern)) {
    return modelsCache[globPattern]
  }

  const sequelizeFiles = getFilesMatchingGlob(globPattern)
  const models = _parseSequelizeFiles(sequelizeFiles, db)

  modelsCache[globPattern] = models

  return models
}