import { ApproxStructure, Assertions, Mouse, StructAssert, UiFinder, Waiter } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { Css, SugarBody } from '@ephox/sugar';
import { TinyDom, TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'hugerte/core/api/Editor';
import AdvListPlugin from 'hugerte/plugins/advlist/Plugin';
import ListsPlugin from 'hugerte/plugins/lists/Plugin';
import { ToolbarMode } from 'hugerte/themes/silver/api/Options';

import { pOpenMore } from '../../../module/MenuUtils';
import { resizeToPos } from '../../../module/UiUtils';

describe('browser.hugerte.themes.silver.editor.toolbar.ReadonlyToolbarResizeTest', () => {
  const hook = TinyHooks.bddSetup<Editor>({
    base_url: '/project/hugerte/js/hugerte',
    plugins: 'advlist lists',
    toolbar: 'bold | italic | underline | strikethrough | cut | copy | paste | indent | subscript | superscript | removeformat | fontfamily | bullist',
    toolbar_mode: 'floating',
    menubar: false,
    width: 800, // Make sure all buttons show initially
    height: 400,
    readonly: true,
    resize: 'both'
  }, [ AdvListPlugin, ListsPlugin ]);

  const resizeTo = (sx: number, sy: number, dx: number, dy: number) => {
    const resizeHandle = UiFinder.findIn(SugarBody.body(), '.tox-statusbar__resize-handle').getOrDie();
    Mouse.mouseDown(resizeHandle);
    resizeToPos(sx, sy, dx, dy);
  };

  const pAssertToolbarButtonState = (label: string, disabled: boolean, f: ApproxStructure.Builder<StructAssert[]>) =>
    Waiter.pTryUntil('Waiting for toolbar state', () => {
      const overlord = UiFinder.findIn(SugarBody.body(), '.tox-toolbar-overlord').getOrDie();
      Assertions.assertStructure(label, ApproxStructure.build((s, str, arr) =>
        s.element('div', {
          classes: [
            arr.has('tox-toolbar-overlord'),
            disabled ? arr.has('tox-tbtn--disabled') : arr.not('tox-tbtn--disabled')
          ],
          attrs: { 'aria-disabled': str.is(disabled + '') },
          children: [
            s.element('div', {
              classes: [ arr.has('tox-toolbar__primary') ],
              children: f(s, str, arr)
            })
          ]
        })
      ), overlord);
    });

  const pAssertToolbarDrawerButtonState = (label: string, f: ApproxStructure.Builder<StructAssert[]>) =>
    Waiter.pTryUntil('Waiting for toolbar state', () => {
      const overflow = UiFinder.findIn(SugarBody.body(), '.tox-toolbar__overflow').getOrDie();
      Assertions.assertStructure(label, ApproxStructure.build((s, str, arr) =>
        s.element('div', {
          classes: [
            arr.has('tox-toolbar__overflow')
          ],
          children: f(s, str, arr)
        })
      ), overflow);
    });

  const disabledButtonStruct = (s: ApproxStructure.StructApi, str: ApproxStructure.StringApi, arr: ApproxStructure.ArrayApi, buttonName: string) => s.element('div', {
    classes: [ arr.has('tox-toolbar__group') ],
    children: [
      s.element('button', {
        classes: [ arr.has('tox-tbtn'), arr.has('tox-tbtn--disabled') ],
        attrs: {
          'data-mce-name': str.is(buttonName),
          'aria-disabled': str.is('true')
        }
      })
    ]
  });

  const enabledButtonStruct = (s: ApproxStructure.StructApi, str: ApproxStructure.StringApi, arr: ApproxStructure.ArrayApi, buttonName: string) => s.element('div', {
    classes: [ arr.has('tox-toolbar__group') ],
    children: [
      s.element('button', {
        classes: [ arr.has('tox-tbtn'), arr.not('tox-tbtn--disabled') ],
        attrs: {
          'data-mce-name': str.is(buttonName),
          'aria-disabled': str.is('false')
        }
      })
    ]
  });

  it('TINY-6383: No exception thrown when switching modes and resizing', () => {
    const editor = hook.editor();
    const container = TinyDom.container(editor);
    Css.set(container, 'width', '200px');
    editor.mode.set('design');

    // Revert back to readonly mode
    editor.mode.set('readonly');
  });

  it('TBA: Test if the toolbar buttons are disabled in readonly mode when toolbar drawer is present', async () => {
    const editor = hook.editor();
    Css.set(TinyDom.container(editor), 'width', '300px');
    await pAssertToolbarButtonState('Assert the first toolbar button, Bold is disabled', true, (s, str, arr) => [
      disabledButtonStruct(s, str, arr, 'bold'),
      s.theRest()
    ]);

    resizeTo(300, 400, 550, 400);

    await pAssertToolbarButtonState('Assert the toolbar buttons are disabled after resizing the editor', true, (s, str, arr) => [
      disabledButtonStruct(s, str, arr, 'bold'),
      disabledButtonStruct(s, str, arr, 'italic'),
      disabledButtonStruct(s, str, arr, 'underline'),
      disabledButtonStruct(s, str, arr, 'strikethrough'),
      disabledButtonStruct(s, str, arr, 'cut'),
      disabledButtonStruct(s, str, arr, 'copy'),
      disabledButtonStruct(s, str, arr, 'paste'),
      disabledButtonStruct(s, str, arr, 'indent'),
      s.theRest()
    ]);
  });

  it('TINY-6014: Test buttons become enabled again when disabling readonly mode and resizing', async () => {
    const editor = hook.editor();
    Css.set(TinyDom.container(editor), 'width', '550px');
    await pAssertToolbarButtonState('Assert the first toolbar button, Bold is disabled', true, (s, str, arr) => [
      disabledButtonStruct(s, str, arr, 'bold'),
      s.theRest()
    ]);
    editor.mode.set('design');
    await pOpenMore(ToolbarMode.floating);
    await pAssertToolbarButtonState('Assert the toolbar buttons are enabled', false, (s, str, arr) => [
      enabledButtonStruct(s, str, arr, 'bold'),
      enabledButtonStruct(s, str, arr, 'italic'),
      enabledButtonStruct(s, str, arr, 'underline'),
      enabledButtonStruct(s, str, arr, 'strikethrough'),
      enabledButtonStruct(s, str, arr, 'cut'),
      enabledButtonStruct(s, str, arr, 'copy'),
      enabledButtonStruct(s, str, arr, 'paste'),
      enabledButtonStruct(s, str, arr, 'indent'),
      s.theRest()
    ]);
    await pAssertToolbarDrawerButtonState('Assert the toolbar drawer buttons are enabled', (s, str, arr) => [
      enabledButtonStruct(s, str, arr, 'subscript'),
      enabledButtonStruct(s, str, arr, 'superscript'),
      enabledButtonStruct(s, str, arr, 'removeformat'),
      s.theRest()
    ]);

    resizeTo(400, 400, 500, 400);

    await pAssertToolbarButtonState('Assert the toolbar buttons are enabled and now include subscript', false, (s, str, arr) => [
      enabledButtonStruct(s, str, arr, 'bold'),
      enabledButtonStruct(s, str, arr, 'italic'),
      enabledButtonStruct(s, str, arr, 'underline'),
      enabledButtonStruct(s, str, arr, 'strikethrough'),
      enabledButtonStruct(s, str, arr, 'cut'),
      enabledButtonStruct(s, str, arr, 'copy'),
      enabledButtonStruct(s, str, arr, 'paste'),
      enabledButtonStruct(s, str, arr, 'indent'),
      enabledButtonStruct(s, str, arr, 'subscript'),
      s.theRest()
    ]);
    await pAssertToolbarDrawerButtonState('Assert the toolbar drawer buttons are enabled', (s, str, arr) => [
      enabledButtonStruct(s, str, arr, 'superscript'),
      enabledButtonStruct(s, str, arr, 'removeformat'),
      s.theRest()
    ]);
  });
});
