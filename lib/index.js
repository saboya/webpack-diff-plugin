var diff = require('diff')
var path = require('path')
var fs = require('fs')

function DiffLoader (content) {
  var plugin

  if (this.options.plugins !== undefined) {
    plugin = this.options.plugins.find(function (plugin) { return plugin instanceof DiffPlugin })
  }

  if (plugin === undefined) {
    throw new Error('Unable to find DiffPlugin instance.')
  }

  Object.keys(plugin.patches).forEach(function (filename) {
    if (filename === this.resourcePath) {
      content = diff.applyPatch(content, plugin.patches[filename])
    }
  }.bind(this))

  return content
}

function DiffPlugin (options) {
  this.options = options
  this.patches = {}
  this.context = ''
}

DiffPlugin.prototype.normalizePath = function (file) {
  if (!path.isAbsolute(file)) {
    file = path.join(this.context, file)
  }

  return path.normalize(file)
}

DiffPlugin.prototype.readPatches = function (files) {
  return files.map(
    filename => diff.parsePatch(fs.readFileSync(filename, 'utf-8'))
  ).reduce((a, b) => a.concat(b), [])
}

DiffPlugin.prototype.apply = function (compiler) {
  var $this = this
  this.context = compiler.options.context

  compiler.plugin('after-plugins', function (compiler) {
    var files = $this.options.files.map(file => $this.normalizePath(file))

    if ($this.options.files === undefined || $this.options.files.length === 0) {
      console.warn('[webpack-diff-plugin] No diff files specified.')
    } else {
      $this.patches = $this.readPatches(files).reduce(function (patches, patch) {
        patch.oldFileName = $this.normalizePath(patch.oldFileName)

        if (patches[patch.oldFileName] === undefined) {
          patches[patch.oldFileName] = patch
        } else {
          patches[patch.oldFileName].hunks = patches[patch.oldFileName].hunks.concat(patch.hunks)
        }

        return patches
      }, {})
    }
  })
}

DiffLoader.plugin = DiffPlugin

module.exports = DiffLoader
