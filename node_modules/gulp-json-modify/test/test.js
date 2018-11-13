'use strict'

var File = require('vinyl')
  , should = require('should')
  , jsonModify = require('..')
require('mocha')

describe('JSON Modify', function() {

  var dotObject = {
    key1: 'value1',
    subkey: {
      key1: 'value2'
    }
  }

  var fakeFile = null

  beforeEach(function() {
    fakeFile = new File({
      base: 'test/',
      cwd: 'test/',
      path: 'test/test-file.json',
      contents: new Buffer(JSON.stringify(dotObject, null, 2))
    })
  })

  describe('Replacements', function() {

    it('should replace simple key', function(done) {
      var output = jsonModify({ key: 'key1', value: 'newValue' })

      output.once('data', function(newFile) {
        var json = JSON.parse(String(newFile.contents))
        json.key1.should.equal('newValue')
        json.subkey.key1.should.equal('value2')
        done()
      })
      output.write(fakeFile)
    })

    it('should replace complex key', function(done) {
      var output = jsonModify({ key: 'subkey.key1', value: 'newValue' })

      output.once('data', function(newFile) {
        var json = JSON.parse(String(newFile.contents))
        json.key1.should.equal('value1')
        json.subkey.key1.should.equal('newValue')
        done()
      })
      output.write(fakeFile)
    })

    it('should work with a falsey value', function(done) {
      var output = jsonModify({ key: 'subkey.key1', value: false })

      output.once('data', function(newFile) {
        var json = JSON.parse(String(newFile.contents))
        json.key1.should.equal('value1')
        json.subkey.key1.should.equal(false)
        done()
      })
      output.write(fakeFile)
    })

  })

  describe('Errors', function() {

    it('should fail when no "key" value provided', function(done) {

      fakeFile.contents = new Buffer(JSON.stringify(dotObject, null, 2))

      var output = jsonModify()

      output.on('error', function(e) {
        should.exist(e)
        e.message.should.equal('Missing "key" option')
        e.fileName.should.containEql(fakeFile.path)
        return done()
      });
      output.write(fakeFile)
      output.end()
    })

    it('should fail when no "value" value provided', function(done) {

      fakeFile.contents = new Buffer(JSON.stringify(dotObject, null, 2))

      var output = jsonModify({ key: 'test' })

      output.on('error', function(e) {
        should.exist(e)
        e.message.should.equal('Missing "value" option')
        e.fileName.should.containEql(fakeFile.path)
        return done()
      });
      output.write(fakeFile)
      output.end()
    })

  })

})
