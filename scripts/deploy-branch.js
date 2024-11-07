#!/usr/bin/env node
'use strict';
require('shelljs/global');
var path = require('path');

set('-e');
set('-v');

var branch = process.env.BRANCH_NAME && process.env.BRANCH_NAME.toLowerCase();
if (branch && branch !== 'gh-pages') {
    var branchPath = path.join('.tmp', 'preview', branch, '/');
    mkdir('-p', branchPath);
    cp('-R', 'web/*', branchPath);
    exec('redocly build-docs ./spec/openapi.yaml -o ' + branchPath + 'index.html');
    exec('redocly bundle ./spec/openapi.yaml     -o ' + branchPath + 'swagger.yaml');
    exec('redocly bundle ./spec/openapi.yaml     -o ' + branchPath + 'swagger.json');

    exec('deploy-to-gh-pages --update .tmp');
}
