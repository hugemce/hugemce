import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';

import { insertNewLineAction, testBeforeInputEvent } from '../../module/test/BeforeInputEventUtils';

describe('browser.hugerte.core.delete.NewlineBeforeInputEventTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    base_url: '/project/hugerte/js/hugerte'
  }, [], true);

  const testNewline = testBeforeInputEvent(insertNewLineAction, 'insertParagraph');

  it('Gets beforeInput', () => {
    testNewline(hook.editor(), '<p><a href="#">a<img src="about:blank"></a></p>', [ 0, 0 ], 1, '<p><a href="#">a</a></p>\n<p><a href="#"><img src="about:blank"></a></p>', false);
  });

  it('Can prevent beforeInput', () => {
    testNewline(hook.editor(), '<p><a href="#">a<img src="about:blank"></a></p>', [ 0, 0 ], 1, '<p><a href="#">a<img src="about:blank"></a></p>', true);
  });
});
