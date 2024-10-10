#!/usr/bin/env node
'use strict';
var Path = require('path');

require('shelljs/global');
set('-e');

mkdir('-p', 'web_deploy');

cp('-R', 'web/*', 'web_deploy/');

exec('redocly build-docs ./spec/openapi.yaml -o web_deploy/index.html');
exec('redocly bundle ./spec/openapi.yaml     -o web_deploy/swagger.yaml');
exec('redocly bundle ./spec/openapi.yaml     -o web_deploy/swagger.json');
