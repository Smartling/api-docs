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
  cp('-R', 'web/*', branchPath);
  exec('npm run swagger bundle -- -o ' + branchPath + 'swagger.json');

  var specFolder = path.join(branchPath, 'spec');
  mkdir('-p', specFolder);
  cp('-R', 'spec/translation_quality', specFolder);
  cp('-R', 'spec/api_common.yaml', specFolder);

  exec('deploy-to-gh-pages --update .tmp');
}
