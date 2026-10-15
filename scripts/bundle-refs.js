'use strict';
var fs = require('fs');
var path = require('path');
require('shelljs/global');

// Bundles the spec(s) in `dir` into self-contained files. Run after the
// spec/ folders are copied into `dir`: `redocly bundle` inlines the path-item
// $refs, which resolve relative to the bundle file. Sub-files must reference
// shared components through ../api_common.yaml. A root-relative
// `#/components/...` ref fails the bundle.
module.exports = function bundleRefs(dir) {
  ['swagger.json', 'swagger.yaml'].forEach(function (name) {
    var file = path.join(dir, name);
    if (!fs.existsSync(file)) {
      return;
    }
    exec('npx redocly bundle ' + file + ' -o ' + file);
  });
};
