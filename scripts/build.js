#!/usr/bin/env node
'use strict';
var Path = require('path');

require('shelljs/global');
set('-e');

mkdir('-p', 'web_deploy');

cp('-R', 'web/*', 'web_deploy/');

exec('npm run swagger build  --        -o web_deploy');
exec('npm run swagger bundle --        -o web_deploy/swagger.json');
exec('npm run swagger bundle -- --yaml -o web_deploy/swagger.yaml');

var SWAGGER_UI_DIST = Path.dirname(require.resolve('swagger-ui-dist'));
rm('-rf', 'web_deploy/swagger-ui/');
cp('-R', SWAGGER_UI_DIST, 'web_deploy/swagger-ui/');
sed('-i', 'https://petstore.swagger.io/v2/swagger.json', '../swagger.json', 'web_deploy/swagger-ui/index.html');

mkdir('-p', 'web_deploy/spec');
cp('-R', 'spec/translation_quality', 'web_deploy/spec');
cp('-R', 'spec/issues', 'web_deploy/spec');
cp('-R', 'spec/file_translation', 'web_deploy/spec');
cp('-R', 'spec/api_common.yaml', 'web_deploy/spec');

