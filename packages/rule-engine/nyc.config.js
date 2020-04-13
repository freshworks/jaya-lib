'use strict';
module.exports = {
  branches: 78,
  'check-coverage': false, // todo: needs to be true
  extends: '@istanbuljs/nyc-config-typescript',
  functions: 80,
  lines: 80,
  statements: 80,
};
