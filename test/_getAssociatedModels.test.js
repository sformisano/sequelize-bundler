const assert = require('assert')
const rewire = require('rewire')
let _getAssociatedModels = null

describe('getBundledSequelizeModels function', () => {
  beforeEach(() => {
    _getAssociatedModels = rewire('../src/_getAssociatedModels')
  })

  it('loops through models passed as argument and runs their associate method if they have it', () => {
    const modelNames = ['user', 'post', 'comment']
    let associated = []
    let testModels = {}

    modelNames.forEach(modelName => {
      testModels[modelName] = {
        associate: () => {
          associated.push(modelName)
        }
      }
    })

    _getAssociatedModels(testModels)

    modelNames.forEach(modelName => {
      assert.ok(associated.indexOf(modelName) !== -1)
    })
  })

  it('passes the models argument as argument of the associate method calls', () => {
    const modelName = 'user'
    let associateArg = null
    const testModels = {
      [modelName]: {
        associate: (arg) => {
          associateArg = arg
        }
      }
    }

    _getAssociatedModels(testModels)

    assert.strictEqual(testModels, associateArg)
  })

  it('returns the models mutated by the associate methods', () => {
    const modelNames = ['setting', 'review', 'event']
    let testModels = { _associated: [] }

    modelNames.forEach(modelName => {
      testModels[modelName] = {
        associate: () => {
          testModels._associated.push(modelName)
        }
      }
    })

    const output = _getAssociatedModels(testModels)

    assert.strictEqual(output, testModels)
  })
})
