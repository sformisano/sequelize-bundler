const _ = require('lodash')
const assert = require('assert')
const rewire = require('rewire')
let _parseSequelizeFiles = null

describe('getBundledSequelizeModels function', () => {
  beforeEach(() => {
    _parseSequelizeFiles = rewire('../src/_parseSequelizeFiles')
  })

  it('parses the sequelize files received as first argument and returns the parsed models', () => {
    const testSequelizeFiles = ['model-a.js', 'model-b.js']

    _parseSequelizeFiles.__set__('_parseSequelizeFile', (sequelizeFile) => {
      return {[sequelizeFile]: true}
    })

    _parseSequelizeFiles.__set__('_getAssociatedModels', (models) => {
      // not testing this feature in this test so nulling this function
      return models
    })

    const output = _parseSequelizeFiles(testSequelizeFiles)
    const matches = _.filter(Object.keys(output), (file) => {
      return testSequelizeFiles.indexOf(file) !== -1
    })

    assert.strictEqual(Object.keys(output).length, testSequelizeFiles.length)
    assert.strictEqual(matches.length, testSequelizeFiles.length)
  })

  it('passes the parsed models to _getAssociatedModels to run associations', () => {
    let modelsArgValue = null
    _parseSequelizeFiles.__set__('_parseSequelizeFile', (file) => {
      return {[file]: true}
    })

    _parseSequelizeFiles.__set__('_getAssociatedModels', (modelsArg) => {
      modelsArgValue = modelsArg
      return modelsArg
    })

    const output = _parseSequelizeFiles(['file.js'],)

    assert.strictEqual(output, modelsArgValue)
  })

  it('returns the models mutated by _getAssociatedModels', () => {
    const expectedOutput = []

    _parseSequelizeFiles.__set__('_parseSequelizeFile', (file) => {
      // does not matter, we're testing _getAssociatedModels as last fn called
      const item = {[file]: true}
      expectedOutput.push(item)
      return item
    })

    _parseSequelizeFiles.__set__('_getAssociatedModels', () => {
      return expectedOutput
    })

    const output = _parseSequelizeFiles(['file.js'],)

    assert.strictEqual(output, expectedOutput)
  })
})
