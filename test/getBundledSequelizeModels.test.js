const assert = require('assert')
const rewire = require('rewire')
let getBundledSequelizeModels = null

describe('getBundledSequelizeModels function', () => {
  beforeEach(() => {
    getBundledSequelizeModels = rewire('../src/getBundledSequelizeModels')
  })

  it('returns the cached models if they exist under the glob pattern argument', () => {
    const globPattern = 'some/place'
    const cachedModels = [{hello: 'world'}]
    const modelsCache = {
      [globPattern]: cachedModels
    }

    getBundledSequelizeModels.__set__('modelsCache', modelsCache)

    assert.strictEqual(getBundledSequelizeModels(globPattern, {}), cachedModels)
  })

  it('gets the files matching the glob pattern argument and passes it to the sequelize parser together with the sequelize instance', () => {
    const fakeDb = {
      hello: 'world'
    }

    const testGlobPattern = 'a/b/*.js'
    let outputGlobPattern = null
    const outputFiles = ['file1.js', 'fileX.js']
    let parserInputFiles = null
    let parserDb = null

    getBundledSequelizeModels.__set__('getFilesMatchingGlob', (globPatternArg) => {
      outputGlobPattern = globPatternArg
      return outputFiles
    })

    getBundledSequelizeModels.__set__('_parseSequelizeFiles', (filesArg, db) => {
      parserInputFiles = filesArg
      parserDb = db
    })

    getBundledSequelizeModels(testGlobPattern, fakeDb)

    assert.strictEqual(testGlobPattern, outputGlobPattern)
    assert.strictEqual(outputFiles, parserInputFiles)
    assert.strictEqual(fakeDb, parserDb)
  })

  it('caches the models and then returns them', () => {
    const demoPattern = 'foo/bar'
    const demoModels = [{hi:'ciao'}]

    const modelsCache = getBundledSequelizeModels.__get__('modelsCache')
    getBundledSequelizeModels.__set__('getFilesMatchingGlob', () => {})
    getBundledSequelizeModels.__set__('_parseSequelizeFiles', (filesArg, db) => {
      return demoModels
    })

    const output = getBundledSequelizeModels(demoPattern, {})

    assert.ok(modelsCache.hasOwnProperty(demoPattern))
    assert.strictEqual(modelsCache[demoPattern], demoModels)
    assert.strictEqual(modelsCache[demoPattern], output)
  })
})