'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var packer = require('zip-stream');
var Queue = require('node-queuer').default;

var chalk = gutil.colors;
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-zip-stream';

function gulpZip(fileName, opts) {
    if (!fileName) {
        throw new PluginError(PLUGIN_NAME, chalk.blue('filename') + ' required');
    }
    var archive = new packer(opts);
    var queue = new Queue();

    var stream = through.obj(function (file, enc, cb) {
        var self = this;
        var pathname = file.relative.replace(/\\/g, '/');
        if (!pathname) {
            cb();
            return;
        }

        if (file.stat && file.stat.isFile && file.stat.isFile()) {
            queue.task(function (done) {
                archive.entry(file.contents, {name: file.relative}, function (err) {
                    if (err) self.emit('error', new PluginError(PLUGIN_NAME, chalk.blue(file.path), err));
                    done();
                });
            });
        }
        cb();
    }, function (callback) {
        queue.task(function (done) {
            archive.finish();
            done();
        });

        var file = new gutil.File({
            path: fileName,
            contents: archive
        });
        this.push(file);
        callback();
    });

    return stream;
}

module.exports = gulpZip;

