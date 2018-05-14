const _ = require('lodash')
const assert = require('assert')
const rewire = require('rewire')
let _parseSequelizeFile = null

describe('getBundledSequelizeModels function', () => {
  beforeEach(() => {
    _parseSequelizeFile = rewire('../src/_parseSequelizeFile')
  })

  it('uses the import method of the sequelize instance passed as second argument to import the model exported by the file passed as first argument', () => {
    const testSequelizeFileName = 'user.js'
    const testSequelizeModelName = 'user'
    const testSequelizeFileContent = {
      name: testSequelizeModelName
    }

    const testSequelizeFile = {
      [testSequelizeFileName]: testSequelizeFileContent
    }

    const fakeDb = {
      import: (fileNameArg) => {
        return testSequelizeFile[fileNameArg]
      }
    }

    const output = _parseSequelizeFile(testSequelizeFileName, fakeDb)

    assert.ok(output.hasOwnProperty(testSequelizeModelName))
    assert.strictEqual(output[testSequelizeModelName].name, testSequelizeModelName)
  })

  it('works properly with sequelize files exporting multiple models', () => {
    const testSequelizeFileName = 'user.js'
    const testSequelizeFiles = {
      [testSequelizeFileName]: [
        {
          name: 'admin'
        },
        {
          name: 'manager'
        },
        {
          name: 'employee'
        }
      ]
    }

    const testModelNames = _.map(testSequelizeFiles[testSequelizeFileName], (model) => {
      return model.name
    })

    const fakeDb = {
      import: (fileNameArg) => {
        return testSequelizeFiles[fileNameArg]
      }
    }

    const output = _parseSequelizeFile(testSequelizeFileName, fakeDb)
    const matches = _.filter(output, (model) => {
      return testModelNames.indexOf(model.name) !== -1
    })

    assert.strictEqual(Object.keys(output).length, testModelNames.length)
    assert.strictEqual(matches.length, testModelNames.length)
  })

  it('returns false if the import function of the second argument (sequelize instance) throws an error', () => {
    const fakeDb = {
      import: () => {
        throw new Error()
      }
    }

    assert.strictEqual(false, _parseSequelizeFile('', fakeDb))
  })
})
