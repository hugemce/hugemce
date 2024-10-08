import { ApproxStructure, DragnDrop } from '@ephox/agar';
import { before, beforeEach, context, describe, it } from '@ephox/bedrock-client';
import { SelectorFind } from '@ephox/sugar';
import { TinyAssertions, TinyDom, TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'hugerte/core/api/Editor';
import Env from 'hugerte/core/api/Env';

describe('browser.hugerte.core.util.QuirksFirefoxTest', () => {
  before(function () {
    if (!Env.browser.isFirefox()) {
      this.skip();
    }
  });

  let events: string[] = [];

  const hook = TinyHooks.bddSetupLight<Editor>({
    add_unload_trigger: false,
    indent: false,
    disable_nodechange: true,
    setup: (editor: Editor) => {
      editor.on('dragstart drop dragend', (e) => {
        events.push(e.type);
      });
    },
    base_url: '/project/hugerte/js/hugerte'
  }, [], true);

  const clearEvents = () =>
    events = [];

  const assertEvents = (expected: string[]) => {
    assert.deepEqual(events, expected);
  };

  beforeEach(() => {
    clearEvents();
  });

  context('addBrAfterLastLinks', () => {
    it('TINY-9172: Should add bogus br after link', () => {
      const editor = hook.editor();
      editor.setContent('<div><a href="#">test</a></div>');
      TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str) => {
        return s.element('body', {
          children: [
            s.element('div', {
              children: [
                s.element('a', { attrs: { href: str.is('#') }, children: [ s.text(str.is('test')) ] }),
                s.element('br', { attrs: { 'data-mce-bogus': str.is('1') }})
              ]
            })
          ]
        });
      }));
    });

    it('TINY-9172: Should add not add bogus br after block link', () => {
      const editor = hook.editor();
      editor.setContent('<div><a href="#"><p>test</p></a></div>');
      TinyAssertions.assertContentStructure(editor, ApproxStructure.build((s, str) => {
        return s.element('body', {
          children: [
            s.element('div', {
              children: [
                s.element('a', {
                  attrs: { 'href': str.is('#'), 'data-mce-block': str.is('true') },
                  children: [
                    s.element('p', { children: [ s.text(str.is('test')) ] })
                  ]
                })
              ]
            })
          ]
        });
      }));
    });
  });

  it('TINY-9694: dragend should fire when drop fires with an image', () => {
    const editor = hook.editor();
    editor.setContent(`
      <table style="border-collapse: collapse; width: 103.363%; height: 355px;" border="1"><colgroup><col style="width: 23.1332%;"><col style="width: 53.8799%;"><col style="width: 23.1332%;"></colgroup>
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <td><img src="https://google.com/logos/google.jpg" alt=""></td>
          </tr>
        </tbody>
      </table>
`);
    DragnDrop.dragnDrop(
      SelectorFind.descendant(TinyDom.body(editor), 'img').getOrDie(),
      SelectorFind.descendant(TinyDom.body(editor), 'td').getOrDie(),
      false
    );
    assertEvents([ 'dragstart', 'drop', 'dragend' ]);
  });
});
