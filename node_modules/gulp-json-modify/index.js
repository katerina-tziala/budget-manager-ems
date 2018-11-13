'use strict'

var path = require('path')
  , pluginError = require('plugin-error')
  , log = require('plugin-log')
  , through = require('through2')
  , Dot = require('dot-object')

module.exports = function(opts) {
  // set task options
  opts = setDefaultOptions(opts)

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file)
    }
    if (file.isStream()) {
      return cb(new pluginError('gulp-json-modify', 'Streaming not supported'))
    }

    if (!opts.key) {
      return cb(new pluginError(
        'gulp-json-modify',
        'Missing "key" option',
        { fileName: file.path, showStack: true }
      ))
    }
    if (typeof opts.value === 'undefined') {
      return cb(new pluginError(
        'gulp-json-modify',
        'Missing "value" option',
        { fileName: file.path, showStack: true }
      ))
    }

    var content = String(file.contents)
    var json
    var dot

    try {
      json = JSON.parse(content)
    } catch (e) {
      return cb(new pluginError('gulp-json-modify', 'Problem parsing JSON file', {
        fileName: file.path,
        showStack: true
      }))
    }

    if (opts.key.indexOf('.') > -1) {
      dot = new Dot()
    }

    if (dot) {
      dot.str(opts.key, opts.value, json)
    } else {
      json[opts.key] = opts.value
    }

    file.contents = new Buffer(
      JSON.stringify(
        json,
        null,
        opts.indent || space(content)
      ) + possibleNewline(content)
    )

    log('Updated \'' + log.colors.cyan(path.basename(file.path)) +
      '\' ' + log.colors.magenta(opts.key) +
      ' to: ' + log.colors.cyan(opts.value))

    cb(null, file)
  })
}

function setDefaultOptions(opts) {
  opts = opts || {}
  opts.indent = opts.indent || void 0
  return opts
}

// Preserve new line at the end of a file
function possibleNewline(json) {
  var lastChar = (json.slice(-1) === '\n') ? '\n' : ''
  return lastChar
}

// Figured out which "space" params to be used for JSON.stringfiy.
function space(json) {
  var match = json.match(/^(?:(\t+)|( +))"/m)
  return match ? (match[1] ? '\t' : match[2].length) : ''
}
