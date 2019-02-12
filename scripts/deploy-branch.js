#!/usr/bin/env node
'use strict';
require('shelljs/global');
var path = require('path');

set('-e');
set('-v');

var branch = process.env.TRAVIS_BRANCH && process.env.TRAVIS_BRANCH.toLowerCase();
if (branch && branch !== 'gh-pages') {
  var branchPath = path.join('.tmp', 'preview', branch, '/');
  mkdir('-p', branchPath);
  exec('npm run swagger bundle -- -o ' + branchPath + 'swagger.json');
  cp('web/index.html', branchPath);

  var specFolder = path.join(branchPath, 'spec');
  mkdir('-p', specFolder);
  cp('-R', 'spec/*', specFolder);
  var swaggerFile = path.join(specFolder, 'swagger.yaml');
  rm('-rf', swaggerFile);

  exec('deploy-to-gh-pages --update .tmp');
}
