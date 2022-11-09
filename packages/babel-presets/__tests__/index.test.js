'use strict';

const babelPresets = require('../src');
const assert = require('assert').strict;

assert.strictEqual(babelPresets(), 'Hello from babelPresets');
console.info("babelPresets tests passed");
