/*
 * slush-slush-cmake
 * https://github.com/julian-becker/slush-slush-cmake
 *
 * Copyright (c) 2018, Julian Becker
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    replace = require('gulp-replace'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        libraryName: 'mylib',
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'libraryName',
        message: 'Name of your new library?',
        default: defaults.libraryName
    }, {
        name: 'libraryDescription',
        message: 'What is the description for this library?'
    }, {
        name: 'libraryVersion',
        message: 'What is the version of your new library?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        type: 'list',
        name: 'testingFramework',
        message: 'What is your preferred testing framework?',
        choices: ['GoogleTest', 'Catch2'],
        default: 'Catch2'
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD', 'UNLICENSE'],
        default: 'UNLICENSE'
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer
        .prompt(prompts)
        .then(function (answers) {
            if (!answers.moveon) {
                return done();
            }

            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            answers.LIBRARYNAME = answers.libraryName.toUpperCase();
            answers.appNameSlug = _.slugify(answers.appName);

            var files = [
                __dirname + '/templates/**',
                __dirname + '/templates_' + answers.testingFramework + '/**',
                __dirname + '/templates_license_' + answers.license + '/**'
            ];

            gulp.src(files)
                .pipe(replace('${','_UGLY_OPENBRACE_'))
                .pipe(replace('}','_UGLY_CLOSINGBRACE_'))
                .pipe(template(answers))
                .pipe(replace('_UGLY_OPENBRACE_','${'))
                .pipe(replace('_UGLY_CLOSINGBRACE_','}'))
                .pipe(rename(function (path) {
                    if (path.basename[0] === '_') {
                        path.basename = '.' + path.basename.slice(1);
                    }
                    path.dirname  = path.dirname
                      .replace(/==(\s*appName\s*)==/g, answers.appName)
                      .replace(/==(\s*libraryName\s*)==/g, answers.libraryName)
                      .replace(/==(\s*libraryName\s*)==/g, answers.libraryName);
                    path.basename = path.basename
                      .replace(/==(\s*appName\s*)==/g, answers.appName)
                      .replace(/==(\s*libraryName\s*)==/g, answers.libraryName)
                      .replace(/==(\s*libraryName\s*)==/g, answers.libraryName);
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
