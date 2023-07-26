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


mkdir('-p', 'web_deploy/spec');
cp('-R', 'spec/translation_quality', 'web_deploy/spec');
cp('-R', 'spec/issues', 'web_deploy/spec');
cp('-R', 'spec/file_translation', 'web_deploy/spec');
cp('-R', 'spec/glossary_v3', 'web_deploy/spec');
cp('-R', 'spec/api_common.yaml', 'web_deploy/spec');

