import { UiFinder } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { Strings } from '@ephox/katamari';
import { SugarBody, TextContent } from '@ephox/sugar';
import { TinyHooks, TinySelections } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'hugerte/core/api/Editor';

describe('browser.hugerte.core.FontSelectCustomTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    base_url: '/project/hugerte/js/hugerte',
    toolbar: 'fontfamily fontsize',
    content_style: [
      '.mce-content-body { font-family: Helvetica; font-size: 42px; }',
      '.mce-content-body p { font-family: Arial; font-size: 12px; }',
      '.mce-content-body h1 { font-family: Arial; font-size: 32px; }'
    ].join(''),
    font_family_formats: 'Arial=arial; Arial Black=arial black; Arial Narrow=arial narrow; Bauhaus 93="bauhaus 93"; Bookman Old Style=bookman old style; Bookshelf Symbol 7=bookshelf symbol 7; Times New Roman=times new roman, times;',
    font_size_formats: '8pt=1 12pt 12.75pt 13pt 24pt 32pt'
  }, []);

  const assertSelectBoxDisplayValue = (title: string, expectedValue: string) => {
    const selectBox = UiFinder.findIn(SugarBody.body(), `*[data-mce-name="${title}"]`).getOrDie();
    const value = Strings.trim(TextContent.get(selectBox) ?? '');
    assert.equal(value, expectedValue, 'Should be the expected display value');
  };

  it('Font family and font size on initial page load', () => {
    assertSelectBoxDisplayValue('fontsize', '12px');
    assertSelectBoxDisplayValue('fontfamily', 'Arial');
  });

  it('Font family with spaces and numbers in the name with legacy font elements', () => {
    const editor = hook.editor();
    editor.setContent(`<p><font face="'bookshelf symbol 7'" size="1">a</font></p>`, { format: 'raw' });
    editor.focus();
    TinySelections.setCursor(editor, [ 0, 0, 0 ], 0);
    editor.nodeChanged();
    assertSelectBoxDisplayValue('fontsize', '8pt');
    assertSelectBoxDisplayValue('fontfamily', 'Bookshelf Symbol 7');
  });

  it('Font family with spaces and numbers in the name', () => {
    const editor = hook.editor();
    editor.setContent(`<p style="font-family: 'bookshelf symbol 7';"></p>`);
    editor.focus();
    TinySelections.setCursor(editor, [ 0, 0 ], 0);
    editor.nodeChanged();
    assertSelectBoxDisplayValue('fontsize', '12px');
    assertSelectBoxDisplayValue('fontfamily', 'Bookshelf Symbol 7');
  });

  it('Font family with quoted font names', () => {
    const editor = hook.editor();
    editor.setContent(`<p style="font-family: 'bauhaus 93';"></p>`);
    editor.focus();
    TinySelections.setCursor(editor, [ 0, 0 ], 0);
    editor.nodeChanged();
    assertSelectBoxDisplayValue('fontsize', '12px');
    assertSelectBoxDisplayValue('fontfamily', 'Bauhaus 93');
  });
});
