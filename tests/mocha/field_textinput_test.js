/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from '../../build/src/core/blockly.js';
import {assert} from '../../node_modules/chai/index.js';
import {
  createTestBlock,
  defineRowBlock,
} from './test_helpers/block_definitions.js';
import {
  assertFieldValue,
  runConstructorSuiteTests,
  runFromJsonSuiteTests,
  runSetValueTests,
} from './test_helpers/fields.js';
import {
  sharedTestSetup,
  sharedTestTeardown,
  workspaceTeardown,
} from './test_helpers/setup_teardown.js';

suite('Text Input Fields', function () {
  setup(function () {
    sharedTestSetup.call(this);
  });
  teardown(function () {
    sharedTestTeardown.call(this);
  });
  /**
   * Configuration for field tests with invalid values.
   * @type {!Array<!FieldCreationTestCase>}
   */
  const invalidValueTestCases = [
    {title: 'Undefined', value: undefined},
    {title: 'Null', value: null},
  ];
  /**
   * Configuration for field tests with valid values.
   * @type {!Array<!FieldCreationTestCase>}
   */
  const validValueTestCases = [
    {title: 'String', value: 'value', expectedValue: 'value'},
    {title: 'Boolean true', value: true, expectedValue: 'true'},
    {title: 'Boolean false', value: false, expectedValue: 'false'},
    {title: 'Number (Truthy)', value: 1, expectedValue: '1'},
    {title: 'Number (Falsy)', value: 0, expectedValue: '0'},
    {title: 'NaN', value: NaN, expectedValue: 'NaN'},
  ];
  const addArgsAndJson = function (testCase) {
    testCase.args = [testCase.value];
    testCase.json = {'text': testCase.value};
  };
  invalidValueTestCases.forEach(addArgsAndJson);
  validValueTestCases.forEach(addArgsAndJson);

  /**
   * The expected default value for the field being tested.
   * @type {*}
   */
  const defaultFieldValue = '';
  /**
   * Asserts that the field property values are set to default.
   * @param {!Blockly.FieldTextInput} field The field to check.
   */
  const assertFieldDefault = function (field) {
    assertFieldValue(field, defaultFieldValue);
  };
  /**
   * Asserts that the field properties are correct based on the test case.
   * @param {!Blockly.FieldTextInput} field The field to check.
   * @param {!FieldValueTestCase} testCase The test case.
   */
  const validTestCaseAssertField = function (field, testCase) {
    assertFieldValue(field, testCase.expectedValue);
  };

  runConstructorSuiteTests(
    Blockly.FieldTextInput,
    validValueTestCases,
    invalidValueTestCases,
    validTestCaseAssertField,
    assertFieldDefault,
  );

  runFromJsonSuiteTests(
    Blockly.FieldTextInput,
    validValueTestCases,
    invalidValueTestCases,
    validTestCaseAssertField,
    assertFieldDefault,
  );

  suite('setValue', function () {
    suite('Empty -> New Value', function () {
      setup(function () {
        this.field = new Blockly.FieldTextInput();
      });
      runSetValueTests(
        validValueTestCases,
        invalidValueTestCases,
        defaultFieldValue,
      );
      test('With source block', function () {
        this.field.setSourceBlock(createTestBlock());
        this.field.setValue('value');
        assertFieldValue(this.field, 'value');
      });
    });
    suite('Value -> New Value', function () {
      const initialValue = 'oldValue';
      setup(function () {
        this.field = new Blockly.FieldTextInput(initialValue);
      });
      runSetValueTests(
        validValueTestCases,
        invalidValueTestCases,
        initialValue,
      );
      test('With source block', function () {
        this.field.setSourceBlock(createTestBlock());
        this.field.setValue('value');
        assertFieldValue(this.field, 'value');
      });
    });
  });

  suite('Validators', function () {
    setup(function () {
      this.field = new Blockly.FieldTextInput('value');
      this.field.valueWhenEditorWasOpened_ = this.field.getValue();
      this.field.htmlInput_ = document.createElement('input');
      this.field.htmlInput_.setAttribute('data-old-value', 'value');
      this.field.htmlInput_.setAttribute('data-untyped-default-value', 'value');
      this.stub = sinon.stub(this.field, 'resizeEditor_');
    });
    teardown(function () {
      sinon.restore();
    });
    const testSuites = [
      {
        title: 'Null Validator',
        validator: function () {
          return null;
        },
        value: 'newValue',
        expectedValue: 'value',
      },
      {
        title: "Remove 'a' Validator",
        validator: function (newValue) {
          return newValue.replace(/a/g, '');
        },
        value: 'bbbaaa',
        expectedValue: 'bbb',
      },
      {
        title: 'Returns Undefined Validator',
        validator: function () {},
        value: 'newValue',
        expectedValue: 'newValue',
        expectedText: 'newValue',
      },
    ];
    testSuites.forEach(function (suiteInfo) {
      suite(suiteInfo.title, function () {
        setup(function () {
          this.field.setValidator(suiteInfo.validator);
        });
        test('When Editing', function () {
          this.field.isBeingEdited_ = true;
          this.field.htmlInput_.value = suiteInfo.value;
          this.field.onHtmlInputChange(null);
          assertFieldValue(
            this.field,
            suiteInfo.expectedValue,
            suiteInfo.value,
          );
        });
        test('When Not Editing', function () {
          this.field.setValue(suiteInfo.value);
          assertFieldValue(this.field, suiteInfo.expectedValue);
        });
      });
    });
  });

  suite('Customization', function () {
    suite('Spellcheck', function () {
      setup(function () {
        this.prepField = function (field) {
          const workspace = {
            getAbsoluteScale: function () {
              return 1;
            },
            getRenderer: function () {
              return {
                getClassName: function () {
                  return '';
                },
              };
            },
            getTheme: function () {
              return {
                getClassName: function () {
                  return '';
                },
              };
            },
            markFocused: function () {},
            options: {},
          };
          field.sourceBlock_ = {
            workspace: workspace,
          };
          field.constants_ = {
            FIELD_TEXT_FONTSIZE: 11,
            FIELD_TEXT_FONTWEIGHT: 'normal',
            FIELD_TEXT_FONTFAMILY: 'sans-serif',
          };
          field.clickTarget_ = document.createElement('div');
          Blockly.common.setMainWorkspace(workspace);
          Blockly.WidgetDiv.createDom();
          this.stub = sinon.stub(field, 'resizeEditor_');
        };

        this.assertSpellcheck = function (field, value) {
          this.prepField(field);
          field.showEditor_();
          assert.equal(
            field.htmlInput_.getAttribute('spellcheck'),
            value.toString(),
          );
        };
      });
      teardown(function () {
        if (this.stub) {
          this.stub.restore();
        }
      });
      test('Default', function () {
        const field = new Blockly.FieldTextInput('test');
        this.assertSpellcheck(field, true);
      });
      test('JS Constructor', function () {
        const field = new Blockly.FieldTextInput('test', null, {
          spellcheck: false,
        });
        this.assertSpellcheck(field, false);
      });
      test('JSON Definition', function () {
        const field = Blockly.FieldTextInput.fromJson({
          text: 'test',
          spellcheck: false,
        });
        this.assertSpellcheck(field, false);
      });
      test('setSpellcheck Editor Hidden', function () {
        const field = new Blockly.FieldTextInput('test');
        field.setSpellcheck(false);
        this.assertSpellcheck(field, false);
      });
      test('setSpellcheck Editor Shown', function () {
        const field = new Blockly.FieldTextInput('test');
        this.prepField(field);
        field.showEditor_();
        field.setSpellcheck(false);
        assert.equal(field.htmlInput_.getAttribute('spellcheck'), 'false');
      });
    });
  });

  suite('Serialization', function () {
    setup(function () {
      this.workspace = new Blockly.Workspace();
      defineRowBlock();

      this.assertValue = (value) => {
        const block = this.workspace.newBlock('row_block');
        const field = new Blockly.FieldTextInput(value);
        block.getInput('INPUT').appendField(field, 'TEXT');
        const jso = Blockly.serialization.blocks.save(block);
        assert.deepEqual(jso['fields'], {'TEXT': value});
      };
    });

    teardown(function () {
      workspaceTeardown.call(this, this.workspace);
    });

    test('Simple', function () {
      this.assertValue('test text');
    });
  });

  suite('Use editor', function () {
    setup(function () {
      this.blockJson = {
        'type': 'math_arithmetic',
        'id': 'test_arithmetic_block',
        'fields': {
          'OP': 'ADD',
        },
        'inputs': {
          'A': {
            'shadow': {
              'type': 'math_number',
              'id': 'left_input_block',
              'name': 'test_name',
              'fields': {
                'NUM': 1,
              },
            },
          },
          'B': {
            'shadow': {
              'type': 'math_number',
              'id': 'right_input_block',
              'fields': {
                'NUM': 2,
              },
            },
          },
        },
      };

      this.getFieldFromShadowBlock = function (shadowBlock) {
        return shadowBlock.getFields().next().value;
      };

      this.simulateTypingIntoInput = (inputElem, newText) => {
        // Typing into an input field changes its value directly and then fires
        // an InputEvent (which FieldInput relies on to automatically
        // synchronize its state).
        inputElem.value = newText;
        inputElem.dispatchEvent(new InputEvent('input'));
      };
    });

    // The block being tested uses full-block fields in Zelos.
    suite('Zelos theme', function () {
      setup(function () {
        this.workspace = Blockly.inject('blocklyDiv', {
          renderer: 'zelos',
        });
        Blockly.serialization.blocks.append(this.blockJson, this.workspace);

        // The workspace actually needs to be visible for focus.
        document.getElementById('blocklyDiv').style.visibility = 'visible';
      });
      teardown(function () {
        document.getElementById('blocklyDiv').style.visibility = 'hidden';
        workspaceTeardown.call(this, this.workspace);
      });

      test('Opening an editor, tabbing, then editing full block field changes the second field', async function () {
        const leftInputBlock = this.workspace.getBlockById('left_input_block');
        const rightInputBlock =
          this.workspace.getBlockById('right_input_block');
        const leftField = this.getFieldFromShadowBlock(leftInputBlock);
        const rightField = this.getFieldFromShadowBlock(rightInputBlock);
        leftField.showEditor();
        // This must be called to avoid editor resize logic throwing an error.
        await Blockly.renderManagement.finishQueuedRenders();

        // Tab, then edit and close the editor.
        document.querySelector('.blocklyHtmlInput').dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Tab',
          }),
        );
        const rightFieldEditor = document.querySelector('.blocklyHtmlInput');
        this.simulateTypingIntoInput(rightFieldEditor, '15');
        rightFieldEditor.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Enter',
          }),
        );

        // Verify that only the right field changed (due to the tab).
        assert.equal(leftField.getValue(), 1);
        assert.equal(rightField.getValue(), 15);
        assert.isNull(document.querySelector('.blocklyHtmlInput'));
      });

      test('Opening an editor, tabbing, then editing full block field changes focus to the second field', async function () {
        const leftInputBlock = this.workspace.getBlockById('left_input_block');
        const rightInputBlock =
          this.workspace.getBlockById('right_input_block');
        const leftField = this.getFieldFromShadowBlock(leftInputBlock);
        Blockly.getFocusManager().focusNode(leftInputBlock);
        leftField.showEditor();
        // This must be called to avoid editor resize logic throwing an error.
        await Blockly.renderManagement.finishQueuedRenders();

        // Tab, then edit and close the editor.
        document.querySelector('.blocklyHtmlInput').dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Tab',
          }),
        );
        const rightFieldEditor = document.querySelector('.blocklyHtmlInput');
        this.simulateTypingIntoInput(rightFieldEditor, '15');
        rightFieldEditor.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Enter',
          }),
        );

        // Verify that the tab causes focus to change to the right field block.
        assert.strictEqual(
          Blockly.getFocusManager().getFocusedNode(),
          rightInputBlock,
        );
        assert.strictEqual(
          document.activeElement,
          rightInputBlock.getFocusableElement(),
        );
      });
    });
  });
});
