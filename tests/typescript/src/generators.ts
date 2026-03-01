/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable */

import * as Blockly from 'blockly-test/core';
import {Order, JavascriptGenerator, javascriptGenerator} from 'blockly-test/javascript';

JavascriptGenerator;

class TestGenerator extends JavascriptGenerator {}

const testGenerator = new TestGenerator();

testGenerator.forBlock['test_block'] = function (
  _block: Blockly.Block,
  _generator: TestGenerator,
) {
  return ['a fake code string', Order.ADDITION];
};

javascriptGenerator.quote_('a string');
