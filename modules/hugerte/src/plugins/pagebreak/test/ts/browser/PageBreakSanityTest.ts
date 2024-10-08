import { ApproxStructure } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';
import Plugin from 'hugerte/plugins/pagebreak/Plugin';

describe('browser.hugerte.plugins.pagebreak.PageBreakSanityTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'pagebreak',
    toolbar: 'pagebreak',
    base_url: '/project/hugerte/js/hugerte'
  }, [ Plugin ]);

  it('TBA: Click on the pagebreak toolbar button and assert pagebreak is inserted', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button[aria-label="Page break"]');
    TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str, arr) => {
      return s.element('body', {
        children: [
          s.element('p', {
            children: [
              s.element('img', {
                classes: [
                  arr.has('mce-pagebreak')
                ]
              })
            ]
          })
        ]
      });
    }));
  });
});
