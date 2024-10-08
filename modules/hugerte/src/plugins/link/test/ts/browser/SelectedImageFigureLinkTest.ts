import { describe, it, before, after } from '@ephox/bedrock-client';
import { TinyHooks, TinySelections, TinyUiActions } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';
import Plugin from 'hugerte/plugins/link/Plugin';

import { TestLinkUi } from '../module/TestLinkUi';

describe('browser.hugerte.plugins.link.SelectedImageFigureTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'link image',
    toolbar: 'link',
    base_url: '/project/hugerte/js/hugerte'
  }, [ Plugin ]);

  before(() => {
    TestLinkUi.clearHistory();
  });

  after(() => {
    TestLinkUi.clearHistory();
  });

  it('TINY-8832: link button should NOT be highlighted when there is no link in a figure element', async () => {
    const editor = hook.editor();
    editor.setContent(`
      <figure class="image no-link"><img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="" width="600" height="400">
        <figcaption>Caption</figcaption>
      </figure>
      <figure class="image has-link"><img src="https://www.w3schools.com/w3css/img_lights.jpg" alt="" width="600" height="400">
        <figcaption><a href="http://tiny.cloud">Caption</a></figcaption>
      </figure>
    `);

    await TinyUiActions.pWaitForUi(editor, '[data-mce-name="link"]:not(.tox-tbtn--enabled)');

    TinySelections.select(editor, 'figure.has-link', []);
    await TinyUiActions.pWaitForUi(editor, '[data-mce-name="link"].tox-tbtn--enabled');

    TinySelections.select(editor, 'figure.no-link', []);
    await TinyUiActions.pWaitForUi(editor, '[data-mce-name="link"]:not(.tox-tbtn--enabled)');
  });

});
