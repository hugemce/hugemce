import { Assertions } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';
import * as Options from 'hugerte/themes/silver/api/Options';

describe('browser.hugerte.themes.silver.editor.ShadowDomInlineTest', () => {
  const hook = TinyHooks.bddSetupInShadowRoot<Editor>({
    base_url: '/project/hugerte/js/hugerte',
    inline: true
  }, []);

  it('UI container should be inside the shadow root', () => {
    const editor = hook.editor();
    Assertions.assertDomEq('Should be shadow root', hook.shadowRoot(), Options.getUiContainer(editor));
  });
});
