import { context, describe, it } from '@ephox/bedrock-client';
import { TinyHooks, TinySelections, TinyUiActions } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';
import Plugin from 'hugerte/plugins/table/Plugin';

describe('browser.hugerte.plugins.table.ToolbarButtonDisplayTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'table',
    toolbar: 'tablecaption',
    base_url: '/project/hugerte/js/hugerte'
  }, [ Plugin ], true);

  const pDisplayTest = async (startPath: number[], startOffset: number, endPath: number[], endOffset: number, shouldBeEnabled: boolean) => {
    const editor = hook.editor();
    editor.setContent('<p>A</p><table><tbody><tr><td>B</td></tr></tbody></table><p>C</p>');
    await TinyUiActions.pWaitForUi(editor, '.tox-tbtn--disabled[data-mce-name="tablecaption"]');
    TinySelections.setSelection(editor, startPath, startOffset, endPath, endOffset);

    if (shouldBeEnabled) {
      await TinyUiActions.pWaitForUi(editor, '.tox-tbtn[data-mce-name="tablecaption"]:not(.tox-tbtn-disabled)');
    } else {
      await TinyUiActions.pWaitForUi(editor, '.tox-tbtn--disabled[data-mce-name="tablecaption"]');
    }
  };

  context('Ensure table caption buttons are enabled when appropriate', () => {
    it('TINY-7737: When the whole selection is in the table', () =>
      pDisplayTest([ 1, 0, 0, 0 ], 0, [ 1, 0, 0, 0 ], 1, true)
    );

    it('TINY-7737: When the selection starts outside the table, but ends in the table', () =>
      pDisplayTest([ 1, 0, 0, 0 ], 0, [ 2 ], 1, false)
    );

    it('TINY-7737: When the selection starts inside the table, but ends outside the table', () =>
      pDisplayTest([ 0 ], 0, [ 1, 0, 0, 0 ], 1, false)
    );

    it('TINY-7737: When the selection starts and ends outside of the table', () =>
      pDisplayTest([ 0 ], 0, [ 2 ], 1, false)
    );
  });
});
